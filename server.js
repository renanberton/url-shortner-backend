const express = require('express');
const shortid = require('shortid');
const cors = require('cors'); // Importe o middleware CORS
const app = express();
const PORT = 5000;

const urlDatabase = {};

app.use(express.json());
app.use(cors()); // Use o middleware CORS para todas as rotas

app.post('/shorten', (req, res) => {
  const { originalUrl } = req.body;
  const shortCode = shortid.generate();
  const shortUrl = `http://localhost:${PORT}/${shortCode}`;

  urlDatabase[shortCode] = originalUrl;

  res.json({ shortUrl });
});

app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const originalUrl = urlDatabase[shortCode];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'URL not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
