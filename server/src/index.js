require('dotenv').config();

const express = require('express');
const buildCors = require('./middleware/cors');
const healthRouter = require('./routes/health');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(buildCors());
app.use(express.json({ limit: '32kb' }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/contact', contactRouter);

// Root
app.get('/', (req, res) => {
  res.json({
    service: 'wtf-api',
    status: 'running',
    endpoints: ['GET /api/health', 'POST /api/contact'],
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('[server] error:', err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`// WTF API listening on :${PORT}`);
});