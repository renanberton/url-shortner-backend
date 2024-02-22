const express = require('express');
const shortid = require('shortid');
const cors = require('cors');
const app = express();
const PORT = 5000;
require('dotenv').config();
const urlDatabase = {};

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/shorten', (req, res) => {
  try {
    const { originalUrl } = req.body;
    const shortCode = shortid.generate();
    const shortUrl = `${process.env.BACKEND_URL}/${shortCode}`;

    console.log('URL original:', originalUrl);
    console.log('Código curto gerado:', shortCode);

    urlDatabase[shortCode] = originalUrl;

    res.json({ shortUrl });
  } catch (error) {
    console.error('Erro ao encurtar URL:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao encurtar a URL. Tente novamente.' });
  }
});

app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const originalUrl = urlDatabase[shortCode];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'URL não encontrada' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em 'http://localhost:${PORT}'`);
});


// Atualize a função serverless para algo assim (no seu arquivo functions/shorten.js, por exemplo):
exports.handler = async (event, context) => {
  try {
    const { originalUrl } = JSON.parse(event.body);
    const shortCode = shortid.generate();
    const shortUrl = `${process.env.BACKEND_URL}/${shortCode}`;

    console.log('URL original:', originalUrl);
    console.log('Código curto gerado:', shortCode);

    urlDatabase[shortCode] = originalUrl;

    return {
      statusCode: 200,
      body: JSON.stringify({ shortUrl }),
    };
  } catch (error) {
    console.error('Erro ao encurtar URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ocorreu um erro ao encurtar a URL. Tente novamente.' }),
    };
  }
};
