# Netlify-Stripe-Payments-Demo
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/JulesBlm/stripe-payments-demo-netlify)

The [Stripe Payments Demo](stripe-payments-demo) converted to work on Netlify with Netlify Lambda. Read [this blog post by Kent C. Dodds](https://kentcdodds.com/blog/super-simple-start-to-serverless) for a nice introduction to serverless with Netlify.

Enter your Stripe API keys,  webhook secret and country into the 'Build environment variables' under 'Deploy Settings'. Like below:

![buildenvvars](screenshots/buildenvvars.png)

And add your webhook endpoint in your Stripe dashboard.

![webhookendpoint](screenshots/webhookendpoint.png)

## Testing

Run `npm run build:webpack` and then run `netlify dev --live` to create a live tunnel for testing.

## Disclaimer

I'm sure there's still a lot of bugs in this as this project is the first time I've written any Lambda function, or any backend code for that matter. 

## To-do List

1. I'm not sure shipping_change endpoint works
2. I'm also not sure all payment methods work
2. Use path parameters instead of query parameters?
