# BACS & Open Banking Demo
This is a demo for taking one-off and recurring payments via BACS and Open Banking using Stripe

## Environment Config

We need to have both test and live keys setup (live is required for the open banking redirect)

STRIPE_TEST_PUB_KEY={{ stripe_test_public_key }}
STRIPE_TEST_SECRET_KEY={{ strip_test_secret_key }}
STRIPE_PUB_KEY={{ stripe_live_public_key }}
STRIPE_SECRET_KEY={{ stripe_live_secret_key }}

# Getting Started
1) Clone this Repo

2) Install Packages

    `> npm install`
3) Setup environment variables

    `> touch .env`
    
    > Add your Stripe API keys

4) Start the Dev Server

    ```> npm run dev```

5) Open the browser

    > http://localhost:3000/



----
Built by [George Rowberry](georgewr@stripe.com)