const app = require('./src/app');

// Start Server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`🍯 Honey Chain Backend API listening on http://localhost:${port}`);
});

module.exports = server;