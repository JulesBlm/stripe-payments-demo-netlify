/**
 * config.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet).
 */

'use strict';

// Load environment variables from the `.env` file.
require('dotenv').config();

module.exports = {
  // Default country for the checkout form.
  country: process.env.STRIPE_ACCOUNT_COUNTRY,

  // Store currency.
  currency: 'eur',

   // Supported payment methods for the store.
  // Some payment methods support only a subset of currencies.
  // Make sure to check the docs: https://stripe.com/docs/sources
  paymentMethods: [
    // 'ach_credit_transfer', // usd (ACH Credit Transfer payments must be in U.S. Dollars)
    'alipay', // aud, cad, eur, gbp, hkd, jpy, nzd, sgd, or usd.
    'bancontact', // eur (Bancontact must always use Euros)
    'card', // many (https://stripe.com/docs/currencies#presentment-currencies)
    'eps', // eur (EPS must always use Euros)
    'giropay', // eur (Giropay must always use Euros)
    'ideal', // eur (iDEAL must always use Euros)
    'multibanco', // eur (Multibanco must always use Euros)
    // 'sepa_debit', // Restricted. See docs for activation details: https://stripe.com/docs/sources/sepa-debit
    'sofort', // eur (SOFORT must always use Euros)
    'wechat', // aud, cad, eur, gbp, hkd, jpy, sgd, or usd.
  ],
 
  // Configuration for Stripe.
  // API Keys: https://dashboard.stripe.com/account/apikeys
  // Webhooks: https://dashboard.stripe.com/account/webhooks
  // Storing these keys and secrets as environment variables is a good practice.
  // You can fill them in your own `.env` file.
  stripe: {
    // The two-letter country code of your Stripe account (required for Payment Request).
    country: process.env.STRIPE_ACCOUNT_COUNTRY || 'US',
    // API version to set for this app (Stripe otherwise uses your default account version).
  // For product retrieval and listing set API version to 2018-02-28 so that skus are returned in products.
    apiVersion: '2019-08-14',
    // Use your test keys for development and live keys for real charges in production.
    // For non-card payments like iDEAL, live keys will redirect to real banking sites.
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    // Setting the webhook secret is good practice in order to verify signatures.
    // After creating a webhook, click to reveal details and find your signing secret.
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  shippingOptions: [
    {
      id: 'free',
      label: 'Free Shipping',
      detail: 'Delivery within 5 days',
      amount: 0,
    },
    {
      id: 'express',
      label: 'Express Shipping',
      detail: 'Next day delivery',
      amount: 500,
    },
  ]
  
};