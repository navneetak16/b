const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Proxy handler
app.use(async (req, res) => {
    try {
        const targetUrl = `https://prod.api.indusgame.com${req.originalUrl}`;

        // Axios request with responseType 'stream' to handle large responses
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                ...req.headers,
                host: 'prod.api.indusgame.com' // override host header
            },
            data: req.body,
            params: req.query,
            responseType: 'stream',
            validateStatus: () => true, // allow all status codes
        });

        // Set response status
        res.status(response.status);

        // Set response headers
        Object.entries(response.headers).forEach(([key, value]) => {
            // Some headers like 'transfer-encoding' may cause issues in streaming, so you might want to skip them
            if (key.toLowerCase() !== 'transfer-encoding') {
                res.setHeader(key, value);
            }
        });

        // Pipe the response stream directly to client
        response.data.pipe(res);

        // Handle errors during streaming
        response.data.on('error', (err) => {
            console.error('Stream error:', err.message);
            res.end();
        });

    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: 'Proxy error' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
