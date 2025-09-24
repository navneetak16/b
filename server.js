const express = require('express');
const http2 = require('http2');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Catch-all route to proxy all requests
app.all('*', (req, res) => {
  // Connect to the upstream server over HTTP/2
  const client = http2.connect('https://prod.api.indusgame.com');

  // Build headers for HTTP/2 request
  const headers = {
    ':method': req.method,
    ':path': req.originalUrl,
    ...req.headers // Forward all client headers exactly
  };

  // Remove headers that might break HTTP/2
  delete headers['host']; // Node sets correct host automatically
  delete headers['connection']; // HTTP/2 manages connection
  delete headers['content-length']; // Node calculates automatically

  const proxyReq = client.request(headers);

  // Forward response headers from upstream
  proxyReq.on('response', (responseHeaders, flags) => {
    if (responseHeaders[':status']) res.status(responseHeaders[':status']);
    Object.entries(responseHeaders).forEach(([key, value]) => {
      if (!key.startsWith(':')) res.setHeader(key, value);
    });
  });

  // Stream response data
  proxyReq.on('data', chunk => res.write(chunk));
  proxyReq.on('end', () => {
    res.end();
    client.close();
  });

  // Stream request body if present
  if (req.body && Object.keys(req.body).length > 0) {
    proxyReq.write(JSON.stringify(req.body));
  }
  proxyReq.end();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HTTP/2 Proxy running on port ${PORT}`));
