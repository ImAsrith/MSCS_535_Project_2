// server.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

app.disable('x-powered-by');
app.use('/static', express.static(path.join(__dirname, 'public')));

// Vulnerable page: no CSP on purpose
app.get('/vulnerable', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/vulnerable.html'));
});

// Fixed page: strict CSP, no inline scripts allowed
const cspMiddleware = helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],          // blocks inline scripts
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    frameAncestors: ["'none'"],
    formAction: ["'self'"]
  }
});

app.get('/fixed', cspMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/fixed.html'));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

