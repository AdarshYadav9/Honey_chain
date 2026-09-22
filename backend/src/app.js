const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const apiRouter = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// REST API endpoints
app.use('/api', apiRouter);

// Serve React frontend build only when present
// (on Render the frontend is deployed separately to Vercel, so it won't exist)
const frontendBuild = path.join(__dirname, '..', '..', 'frontend', 'build');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

module.exports = app;