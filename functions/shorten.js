const shortid = require('shortid');
const urlDatabase = {};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    try {
      const { originalUrl } = JSON.parse(event.body);
      const shortCode = shortid.generate();
      const shortUrl = `https://url-shortner-brasil.netlify.app/${shortCode}`;

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
  } else if (event.httpMethod === 'GET') {
    const shortCode = event.path.split('/').pop();
    const originalUrl = urlDatabase[shortCode];

    if (originalUrl) {
      return {
        statusCode: 302,
        headers: {
          Location: originalUrl,
        },
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'URL não encontrada' }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }
};
