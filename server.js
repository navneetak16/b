const express = require('express');
const http2 = require('http2');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Catch-all route to proxy all requests
app.all('*', async (req, res) => {
    const client = http2.connect('https://prod.api.indusgame.com');

    // Map Express method to HTTP/2
    const headers = {
        ':method': req.method,
        ':path': req.originalUrl,
        'content-type': req.headers['content-type'] || 'application/json',
        'x-request-token': req.headers['x-request-token'] || '',
        'x-build-version': req.headers['x-build-version'] || '',
        'x-social-info': req.headers['x-social-info'] || '',
        'x-device-id': req.headers['x-device-id'] || '',
        'user-agent': req.headers['user-agent'] || 'Node.js-HTTP2-Proxy',
        'accept-encoding': req.headers['accept-encoding'] || 'gzip'
    };

    const proxyReq = client.request(headers);

    // Forward response headers and status
    proxyReq.on('response', (responseHeaders, flags) => {
        res.status(responseHeaders[':status'] || 200);
        Object.entries(responseHeaders).forEach(([k, v]) => {
            if (!k.startsWith(':')) res.setHeader(k, v);
        });
    });

    // Pipe response data
    proxyReq.on('data', chunk => res.write(chunk));
    proxyReq.on('end', () => {
        res.end();
        client.close();
    });

    // Pipe request body
    if (req.body && Object.keys(req.body).length > 0) {
        proxyReq.write(JSON.stringify(req.body));
    }
    proxyReq.end();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`HTTP/2 Proxy Server running on port ${PORT}`);
});
