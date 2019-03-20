# Netlify-Stripe-Payments-Demo
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/JulesBlm/stripe-payments-demo-netlify)

The [Stripe Payments Demo](stripe-payments-demo) converted to work on Netlify with Netlify Lambda. 

Enter your Stripe API keys,  webhook secret and country into the 'Build environment variables' under 'Deploy Settings'. Like below:

![buildenvvars](screenshots/buildenvvars.png)

And add your webhook endpoint in your Stripe dashboard.

![webhookendpoint](screenshots/webhookendpoint.png)

## Disclaimer

I'm sure there's still a lot of bugs in this as this project is the first time I've written any Lambda function, or any backend code for that matter. 

## To-do List

1. I'm not sure shipping_change endpoint works
2. Improve way to test locally
3. Update to netlify-cli instead of netlify-lambda
4. Update to latest Stripe API version
5. Don't hardcode LAMBDA_ENDPOINT?
