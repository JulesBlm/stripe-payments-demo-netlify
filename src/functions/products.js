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
            return;
        } else {
            // console.log("product retrieve list first time");
            const productList = await products.list();
            console.log(productList.data);
            // Check if products exist on Stripe Account.
            if (products.exist(productList)) {
                console.log("Product exists");
                return {
                    statusCode: 200,
                    body: JSON.stringify(productList.data)
                };
            } else {
                console.log("Product does not exist");
                return {
                    statusCode: 200,
                    body: JSON.stringify(products.list())
                };
            }
        }
    } else {
        return {
            statusCode: 400,
            body: "/products IS A NOT POST METHOD"
        };        
    }
};