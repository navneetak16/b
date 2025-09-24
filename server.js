const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Catch-all proxy route for all endpoints
app.use(async (req, res) => {
    try {
        // Construct target URL dynamically
        const targetUrl = `https://prod.api.indusgame.com${req.originalUrl}`;

        // Forward request to the target API using streaming
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                ...req.headers,
                host: 'prod.api.indusgame.com', // ensure host header is correct
            },
            data: req.body,
            params: req.query,
            responseType: 'stream',
            validateStatus: () => true // allow all HTTP status codes
        });

        // Set response status
        res.status(response.status);

        // Copy response headers, skipping 'transfer-encoding' for streaming
        Object.entries(response.headers).forEach(([key, value]) => {
            if (key.toLowerCase() !== 'transfer-encoding') {
                res.setHeader(key, value);
            }
        });

        // Pipe response stream to client
        response.data.pipe(res);

        // Handle streaming errors
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
