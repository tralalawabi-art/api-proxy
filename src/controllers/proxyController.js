const axios = require('axios');

exports.handleProxy = async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({
            success: false,
            message: "Parameter 'url' tidak ditemukan."
        });
    }

    try {
        const response = await axios({
            method: 'get',
            url: targetUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            },
            timeout: 15000,
            validateStatus: false
        });

        let formattedContent;
        
        // Jika respon dari target adalah Object/JSON, kita buat jadi string yang rapi (\n dan spasi)
        if (typeof response.data === 'object') {
            // null, 2 artinya memberikan indentasi 2 spasi dan karakter \n (newline)
            formattedContent = JSON.stringify(response.data, null, 2);
        } else {
            formattedContent = String(response.data);
        }

        // Konstruksi Response sesuai permintaan kamu
        const result = {
            attribution: "@Fmc",
            data: {
                content: formattedContent, // Ini akan mengandung \n dan spasi rincian
                length: response.headers['content-length'] || String(formattedContent.length),
                status: response.status,
                type: response.headers['content-type'] || "application/json; charset=utf-8",
                url: targetUrl
            },
            statusCode: 200,
            success: true,
            timestamp: new Date().toISOString().split('.')[0] + 'Z' 
        };

        // Kirim respon
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(JSON.stringify(result, null, 2));

    } catch (error) {
        return res.status(500).json({
            attribution: "@GiMi",
            success: false,
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
