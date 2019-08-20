const { products } = require('./helpers/inventory');

exports.handler = async function(event, context) {
    if (event.httpMethod === 'GET') {
        console.log("/products", {event} );

        // Retrieve a product by ID.
        if (event.queryStringParameters.id) {
            console.log("products/ : Querying by id", event.queryStringParameters.id);
            return {
                statusCode: 200,
                body: JSON.stringify(await products.retrieve(event.queryStringParameters.id))
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify(await products.list())
            };
        }
    } else {
        return {
            statusCode: 400,
            body: "/products IS A NOT POST METHOD"
        };        
    }
};