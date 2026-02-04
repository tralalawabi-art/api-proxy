const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// --- LOGIKA CONTROLLER ---
const handleProxy = async (req, res) => {
    let targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({
            success: false,
            message: "Parameter 'url' diperlukan."
        });
    }

    // Auto-fix URL jika tidak ada protocol
    if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
    }

    try {
        const response = await axios({
            method: 'get',
            url: targetUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            },
            timeout: 15000,
            validateStatus: false 
        });

        // Membuat format content agar ada \n dan spasi (seperti permintaan kamu)
        let formattedContent;
        if (typeof response.data === 'object') {
            formattedContent = JSON.stringify(response.data, null, 2);
        } else {
            formattedContent = String(response.data);
        }

        const result = {
            attribution: "@GiMi",
            data: {
                content: formattedContent,
                length: response.headers['content-length'] || String(formattedContent.length),
                status: response.status,
                type: response.headers['content-type'] || "application/json; charset=utf-8",
                url: targetUrl
            },
            statusCode: 200,
            success: true,
            timestamp: new Date().toISOString().replace(/\.\d{3}/, '')
        };

        // Mengirim respon dengan header JSON yang benar
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(JSON.stringify(result, null, 2));

    } catch (error) {
        return res.status(500).json({
            attribution: "@GiMi",
            success: false,
            error: "Gagal mengambil data",
            message: error.message
        });
    }
};

// --- ROUTING SYSTEM ---
router.get('/proxy', handleProxy);

// Gunakan routing dengan prefix /api/tools
app.use('/api/tools', router);

// Handle root path agar tidak 404
app.get('/', (req, res) => {
    res.send("API Proxy Ready. Gunakan endpoint /api/tools/proxy?url=");
});

module.exports = app;
