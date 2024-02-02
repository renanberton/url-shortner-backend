const express = require('express');
const shortid = require('shortid');
const cors = require('cors'); 
const { resolve } = require('url');
const app = express();
const PORT = 5000;
require('dotenv').config();

const urlDatabase = {};

app.use(express.json());
app.use(cors()); 

app.post('/shorten', (req, res) => {
  const { originalUrl } = req.body;
  const shortCode = shortid.generate();
  const shortUrl = resolve(process.env.BACKEND_URL, shortCode);

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


