const { products } = require('./helpers/inventory');
const { headers } = require('./helpers/headers');

exports.handler = async function(event, context, callback) {
  if (event.httpMethod === 'GET' && event.queryStringParameters.id) {  
    const productByID = await products.retrieve(event.queryStringParameters.id);
    console.log({productByID});

    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({productByID})
    });

} else {
    callback(null, {
      statusCode: 400,
      body: "/id: Need query parameter"
    });
  }
};