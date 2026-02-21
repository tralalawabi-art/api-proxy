const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Route
app.get('/api/tools/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    const startTime = Date.now();

    // 1. Validasi jika URL tidak ada
    if (!targetUrl) {
        return res.status(400).json({
            success: false,
            message: "Parameter 'url' diperlukan."
        });
    }

    try {
        // 2. Lakukan request ke URL tujuan
        const response = await axios({
            method: 'get',
            url: targetUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Referer': new URL(targetUrl).origin, // Penting untuk bypass beberapa proteksi hotlink
                'Accept': 'application/json, text/plain, */*'
            },
            timeout: 10000 // 10 detik timeout
        });

        const endTime = Date.now();
        const responseTime = `${endTime - startTime}ms`;

        // 3. Susun Response sesuai permintaan
        res.status(200).json({
            success: true,
            result: {
                status: response.status,
                content: response.data, // Ini otomatis jadi object jika target kirim JSON
                headers: response.headers
            },
            timestamp: new Date().toISOString(),
            responseTime: responseTime
        });

    } catch (error) {
        const endTime = Date.now();
        
        // Handle Error (Misal: 404 atau Timeout)
        res.status(error.response?.status || 500).json({
            success: false,
            result: {
                status: error.response?.status || 500,
                content: error.response?.data || "Failed to fetch data from the target URL",
                headers: error.response?.headers || {}
            },
            timestamp: new Date().toISOString(),
            responseTime: `${endTime - startTime}ms`,
            error_message: error.message
        });
    }
});

// Export untuk Vercel Serverless
module.exports = app;
