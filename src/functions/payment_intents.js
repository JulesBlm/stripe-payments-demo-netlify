const { products } = require('./helpers/inventory');
const config = require('./helpers/configHelper');
const stripe = require('stripe')(config.stripe.secretKey);
stripe.setApiVersion(config.stripe.apiVersion);

// Calculate total payment amount based on items in basket.
const calculatePaymentAmount = async items => {
    const productList = await products.list();
    // Look up sku for the item so we can get the current price.
    const skus = productList.data.reduce(
      (a, product) => [...a, ...product.skus.data],
      []
    );
    const total = items.reduce((a, item) => {
      const sku = skus.filter(sku => sku.id === item.parent)[0];
      return a + sku.price * item.quantity;
    }, 0);
    return total;
};

// Create the PaymentIntent on the backend.
exports.handler = async function(event, context, callback) {
    if (event.httpMethod === 'POST') {
        console.log("POST METHOD")
        let { currency, items, customer_email } = JSON.parse(event.body);
        const amount = await calculatePaymentAmount(items);

        console.log({ customer_email });
        console.log({ amount });
        console.log("paymentmethods", config.paymentMethods);

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                payment_method_types: config.paymentMethods,
            });

            console.log("Succes!", paymentIntent);

            callback(null, {
                statusCode: 200,
                body: JSON.stringify(paymentIntent)
            });
        } catch (err) {
            console.log("error", err);
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({err: err.message})
            });
        }
    } else if (event.httpMethod === 'GET') {
        console.log("GET STATUS");
        const paymentIntent = await stripe.paymentIntents.retrieve(event.queryStringParameters.id);
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({paymentIntent: {status: paymentIntent.status}})
        });
    } else {
        callback(null, {
          statusCode: 400,
          body: "/payment_intents: THIS IS A NOT GET METHOD"
        });
    }
}