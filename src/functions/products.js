const { products } = require('./helpers/inventory');

const headers = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers": "Content-Type"
  };

exports.handler = async function(event, context, callback) {
    if (event.httpMethod === 'GET') {
        console.log("/products", {event} );

        // Retrieve a product by ID.
        if (event.queryStringParameters.id) {
            console.log("products/ : Querying by id", event.queryStringParameters.id);
 
            callback(null, {
                statusCode: 200,
                headers,
                body: JSON.stringify(await products.retrieve(event.queryStringParameters.id))
            });
            return;
        } else {
            // console.log("product retrieve list first time");
            const productList = await products.list();
            console.log(productList.data);
            // Check if products exist on Stripe Account.
            if (products.exist(productList)) {
                console.log("Product exists");
                callback(null, {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(productList.data)
                });
            } else {
                console.log("Product does not exist");
                callback(null, {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(products.list())
                });
            }
        }
    } else {
        callback(null, {
            statusCode: 400,
            body: "/products IS A NOT POST METHOD"
        });        
    }
};