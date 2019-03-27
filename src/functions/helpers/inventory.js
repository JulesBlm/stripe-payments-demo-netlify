//move into subfolder
const config = require('./configHelper');

/**
 * inventory.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet).
 *
 * Simple library to store and interact with orders and products.
 * These methods are using the Stripe Orders API, but we tried to abstract them
 * from the main code if you'd like to use your own order management system instead.
 */

'use strict';

const stripe = require('stripe')(config.stripe.secretKey);
stripe.setApiVersion(config.stripe.apiVersion);

// List all products.
const listProducts = async () => {
  return await stripe.products.list({limit: 3, type: 'good' });
};

// Retrieve a product by ID.
const retrieveProduct = async productId => {
  return await stripe.products.retrieve(productId);
};

// Validate that products exist.
const productsExist = productList => {
  const validProducts = ['increment', 'shirt', 'pins', 'muts'];
  return productList.data.reduce((accumulator, currentValue) => {
    return (
      accumulator
      && productList.data.length === 4 &&
      validProducts.includes(currentValue.id)
    );
  }, !!productList.data.length);
};

// Get shipping cost from config based on selected shipping option.
const getShippingCost = shippingOption => {
  return config.shippingOptions.filter(
    option => option.id === shippingOption
  )[0].amount;
};

exports.products = {
  list: listProducts,
  retrieve: retrieveProduct,
  exist: productsExist,
  getShippingCost,
};