// functions/shorten.js
exports.handler = async (event, context) => {
   // Seu código para lidar com a rota /shorten aqui
   return {
     statusCode: 200,
     body: JSON.stringify({ message: 'Sua função Netlify para /shorten está funcionando!' }),
   };
 };
 