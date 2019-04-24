const config = require('./helpers/configHelper');
const stripe = require('stripe')(config.stripe.secretKey);

// Webhook handler to process payments for sources asynchronously.
exports.handler = async function(event, context, callback) {
    // console.log("event.body type", type of event.body);
    if (event.httpMethod === 'POST') {
      let data;
      let eventType;
  
      // Check if webhook signing is configured.
      if (config.stripe.webhookSecret) {
        // console.log("WebHook secret configured");

        // Retrieve the event by verifying the signature using the raw body and secret.
        let StripeEvent;
        let signature = event.headers['stripe-signature'];
        
        try {
          StripeEvent = stripe.webhooks.constructEvent(
            event.body,
            signature,
            config.stripe.webhookSecret
          );

          console.log(`✅ WebHook secret configured and signed`,);

        } catch (err) {
          console.log(`⚠️ Webhook signature verification failed.`, err);
          //return res.sendStatus(400);
          return {
            statusCode: 400
          };
        }

        // Extract the object from the event.
        data = StripeEvent.data;
        eventType = StripeEvent.type;
      } else {
        console.log("🚫SECRET NOT CONFIGURED");
        // Webhook signing is recommended, but if the secret is not configured in `config.js`, retrieve the event data directly from the request body.
        data = event.body.data;
        eventType = event.body.type;
      }
      const object = data.object;
      
      // PaymentIntent Beta, see https://stripe.com/docs/payments/payment-intents 
      // Monitor payment_intent.succeeded & payment_intent.payment_failed events.
      if (object.object === 'payment_intent') {
        const paymentIntent = object;
        if (eventType === 'payment_intent.succeeded') {
          console.log(`🔔  Webhook received! Payment for PaymentIntent ${paymentIntent.id} succeeded.`);
        } else if (eventType === 'payment_intent.payment_failed') {
          console.log(
            `🔔  Webhook received! Payment on source ${
              paymentIntent.last_payment_error.source.id
            } for PaymentIntent ${paymentIntent.id} failed.`
          );
          // Note: you can use the existing PaymentIntent to prompt your customer to try again by attaching a newly created source:
          // https://stripe.com/docs/payments/payment-intents#lifecycle
        }
      }      
      
      // Monitor `source.chargeable` events.
      if (
        object.object === 'source' &&
        object.status === 'chargeable' &&
        object.metadata.paymentIntent
        ) {
        const source = object;
        console.log(`🔔  Webhook received! The source ${source.id} is chargeable.`);
        // Find the corresponding PaymentIntent this source is for by looking in its metadata.
        const paymentIntent = await stripe.paymentIntents.retrieve(
          source.metadata.paymentIntent
        );
        // Check whether this PaymentIntent requires a source.
        if (paymentIntent.status != 'requires_payment_method') {
          return {
            statusCode: 403,
          };
        }

        // Confirm the PaymentIntent with the chargeable source.
        await stripe.paymentIntents.confirm(paymentIntent.id, {source: source.id});
      }
          
      // Monitor `source.failed` and `source.canceled` events.
      if (
        object.object === 'source' &&
        ['failed', 'canceled'].includes(object.status) &&
        object.metadata.paymentIntent
      ) {
        const source = object;
        console.log(`🔔  The source ${source.id} failed or timed out.`);
        // Cancel the PaymentIntent.
        await stripe.paymentIntents.cancel(source.metadata.paymentIntent);
      }

    // Monitor `source.failed` and `source.canceled` events.
    if (
      object.object === 'source' &&
      ['failed', 'canceled'].includes(object.status) &&
      object.metadata.paymentIntent
    ) {
      const source = object;
      console.log(`🔔  The source ${source.id} failed or timed out.`);
      // Cancel the PaymentIntent.
      await stripe.paymentIntents.cancel(source.metadata.paymentIntent);
    }
    
    console.log("At the end!")

    // Return a 200 success code to Stripe.
    return {
      statusCode: 200
    };
 
  } else {
    return {
      statusCode: 400,
      body: "/webhook: THIS IS A POST ONLY"
    };
  }
}