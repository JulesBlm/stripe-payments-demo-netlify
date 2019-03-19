# Netlify-Stripe-Payments-Demo

The [Stripe Payments Demo](stripe-payments-demo) converted to work on Netlify with Netlify Lambda. 



Enter your Stripe API keys and webhook secret into the 'Build environment variables' under 'Deploy Settings'



## Disclaimer

I'm sure there's still a lot of bugs in this as this project is the first time I've written any Lambda function, or any backend code for that matter. 

## To-do List

1. I'm not sure shipping_change endpoint worksiss
2. Improve way to test locally
3. Update to netlify-cli instead of netlify-lambda
4. Update to latest Stripe API version
5. Don't hardcode LAMBDA_ENDPOINT?