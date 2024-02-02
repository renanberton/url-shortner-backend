   const express = require('express');
   const shortid = require('shortid');
   const cors = require('cors');
   const { resolve } = require('url');
   const app = express();
   const PORT = 5000;
   require('dotenv').config();
   const urlDatabase = {};

   const corsOptions = {
      origin: 'https://url-shortner-brasil.netlify.app',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 204,
    };
    
   app.use(cors(corsOptions));

   app.use(express.json());

   app.post('/shorten', (req, res) => {
   const { originalUrl } = req.body;
   const shortCode = shortid.generate();
   const shortUrl = `${process.env.BACKEND_URL}/${shortCode}`;

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
   console.log(`Server is running on '${process.env.BACKEND_URL}:${PORT}'`);
   });
