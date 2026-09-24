const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const apiRouter = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// REST API endpoints
app.use('/api', apiRouter);

// API-only deployment: frontend is hosted on Vercel
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Route not found'
  });
});

module.exports = app;