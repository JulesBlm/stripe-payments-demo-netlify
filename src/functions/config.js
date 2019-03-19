const { headers } = "./helpers/headers";
const configHelper = require('./helpers/configHelper');

exports.handler = async function(event, context, callback) {    
    callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            stripePublishableKey: configHelper.stripe.publishableKey,
            stripeCountry: configHelper.stripe.country,
            country: configHelper.country,
            currency: configHelper.currency,
            paymentMethods: configHelper.paymentMethods,
            shippingOptions: configHelper.shippingOptions,            
        })
    })
};