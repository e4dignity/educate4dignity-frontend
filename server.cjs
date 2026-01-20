// Minimal Express server to serve the built SPA on Render Web Service
// Usage: npm run build && node server.cjs
const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 10000;

app.disable('x-powered-by');
app.use(compression());

// Static assets with long cache. index.html will override below.
app.use(express.static(DIST, {
  extensions: ['html'],
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
