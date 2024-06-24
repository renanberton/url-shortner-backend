const shortid = require('shortid');

// Armazenamento em memória para URLs encurtadas
const urlDatabase = {};

// Configurações CORS
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    // Responder preflight requests para CORS
    return {
      statusCode: 200,
      headers,
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const { originalUrl } = JSON.parse(event.body);
      const shortCode = shortid.generate();
      const shortUrl = `https://url-shortner-brasil.netlify.app/${shortCode}`;

      console.log('URL original:', originalUrl);
      console.log('Código curto gerado:', shortCode);

      // Armazenar no banco de dados em memória
      urlDatabase[shortCode] = originalUrl;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ shortUrl }),
      };
    } catch (error) {
      console.error('Erro ao encurtar URL:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Ocorreu um erro ao encurtar a URL. Tente novamente.' }),
      };
    }
  } else if (event.httpMethod === 'GET') {
    const shortCode = event.path.replace('/', '');

    if (urlDatabase[shortCode]) {
      // Redirecionar para o URL original
      return {
        statusCode: 302,
        headers: {
          Location: urlDatabase[shortCode],
        },
      };
    } else {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'URL não encontrada' }),
      };
    }
  } else {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }
};
