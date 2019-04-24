const { products } = require('./helpers/inventory');
const config = require('./helpers/configHelper');
const stripe = require('stripe')(config.stripe.secretKey);
stripe.setApiVersion(config.stripe.apiVersion);

// Update PaymentIntent with shipping cost.
exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST' && event.queryStringParameters.id) {  
    console.log("querystingparameter", event.queryStringParameters);
    const {items, shippingOption} = JSON.parse(event.body);
    let amount = await calculatePaymentAmount(items);
    amount += products.getShippingCost(shippingOption.id);
  
    try {
      const paymentIntent = await stripe.paymentIntents.update(event.queryStringParameters.id, {
        amount,
      });
  
      return {
        statusCode: 200,
        body: JSON.stringify({paymentIntent})
      };

    } catch (err) {
      console.log("error", err)
      return {
        statusCode: 500,
        body: JSON.stringify({error: err.message})
      };
    }
} else {
    return {
      statusCode: 400,
      body: "/shipping_change: THIS IS A NOT POST METHOD"
    };
  }
}