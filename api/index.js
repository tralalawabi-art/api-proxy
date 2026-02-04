const express = require('express');
const cors = require('cors');
const toolsRoutes = require('../src/routes/tools');

const app = express();

app.use(cors());
app.use(express.json());

// Routing ke file tools
app.use('/api/tools', toolsRoutes);

module.exports = app;
