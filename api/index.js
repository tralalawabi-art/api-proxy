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
        // 2. Lakukan request ke URL tujuan dengan Header Browser Lengkap
        const response = await axios({
            method: 'get',
            url: targetUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.google.com/',
                'Cache-Control': 'max-age=0',
                'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'cross-site', // Diubah ke cross-site agar lebih natural sebagai proxy
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'Connection': 'keep-alive',
            },
            timeout: 15000 // Saya naikkan ke 15 detik karena Cloudflare butuh waktu lebih lama untuk memproses
        });

        const endTime = Date.now();
        const responseTime = `${endTime - startTime}ms`;

        // 3. Susun Response (Struktur tetap sama dengan api lama Anda)
        res.status(200).json({
            success: true,
            result: {
                status: response.status,
                content: response.data, 
                headers: response.headers
            },
            timestamp: new Date().toISOString(),
            responseTime: responseTime
        });

    } catch (error) {
        const endTime = Date.now();
        
        // Handle Error tanpa mengubah struktur response asli Anda
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
