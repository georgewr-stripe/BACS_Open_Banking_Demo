// Shouldn't do this normally but Open Banking redirect only works in live mode
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27;customer_balance_payment_method_beta=v2",
});

const stripeTest = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY, {
  apiVersion: "2020-08-27;customer_balance_payment_method_beta=v2",
});

export default async function handler(req, res) {
  const data = req.body;
  console.log(data);

  const resp = { error: "" };
  let status = 200;

  const thisURL = "http://localhost:3000/";

  // Create a customer NB in practise you may try and get this from login or email
  const customer = await stripe.customers.create({
    email: "georgewr@stripe.com",
    name: "George Rowberry",
  });

  if (data.method == "bacs_debit") {
    /////////////////////////
    // Handle BACS Payment //
    /////////////////////////

    // Setup the checkout session universal config
    const config = {
      payment_method_types: ["bacs_debit"],
      customer: customer.id,
      success_url: thisURL + "success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: thisURL + "cancel",
    };

    if (data.period == "once") {
      ////////////////////
      // Single Payment //
      ////////////////////

      config.mode = "payment";
      config.payment_intent_data = {
        setup_future_usage: "off_session",
      };
      config.line_items = [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "One-Off Donation to the Church",
            },
            unit_amount: Number(data.amount) * 100,
          },
          quantity: 1,
        },
      ];
    } else {
      // Recurring Payment
      config.mode = "subscription";
      config.line_items = [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Recurring Donation to Church",
            },
            unit_amount: Number(data.amount) * 100,
            recurring: {
              interval: data.period,
            },
          },
          quantity: 1,
        },
      ];
    }
    // Create the checkout session
    const session = await stripe.checkout.sessions.create(config);
    resp.redirect_url = session.url;

  } else if (data.method == 'bacs_debit_embedded') {

    if (data.create_setup_intent) {
      // Create a Customer
      const customer = await stripeTest.customers.create({
        email: "georgewr@stripe.com",
        name: "George Rowberry",
      });

      // Create a Setup Intent
      const setupIntent = await stripeTest.setupIntents.create({
        payment_method_types: ['bacs_debit'],
        customer: customer.id,
      });
      resp.setup_intent_client_secret = setupIntent.client_secret;

    } else {

      // Create a price for the donation 
      const priceConfig = {
        currency: "gbp",
        unit_amount: Number(data.amount) * 100,
        product_data: {
          name: "Donation to the Church",
          statement_descriptor: "Church Donation",
        },
      }
      // Make it reccuring if monthly or annual
      if (data.period != 'once') {
        priceConfig.recurring = {
          interval:  data.period, // day | month | week | year 
        }
      }
      const price = await stripeTest.prices.create(priceConfig)

      // Get the payment method
      const paymentMethod = await stripeTest.paymentMethods.retrieve(data.payment_method_id)

      // Create a Subscription
      const subsciption = await stripeTest.subscriptions.create({
        customer: paymentMethod.customer,
        items: [{price: price.id}],
        default_payment_method: data.payment_method_id
      })
    }

  } else if (data.method == "pay_by_bank" || data.method == "pay_by_bank_qr") {
    //////////////////////////
    // Handle Bank Transfer //
    //////////////////////////

    if (data.period == "once") {
      // Create a payment intent
      const intent = await stripe.paymentIntents.create({
        amount: Number(data.amount) * 100,
        currency: "gbp",
        customer: customer.id,
        currency: "gbp",
        payment_method_types: ["pay_by_bank"],
        payment_method_data: {
          type: "pay_by_bank",
        },
        payment_method_options: {
          pay_by_bank: {
            country: "gb",
            locale: "en-gb",
            statement_descriptor: "Church",
          },
        },
        return_url: thisURL + "success",
        confirm: true,
      });
      console.log(intent);

      resp.redirect_url = intent.next_action.redirect_to_url.url;
    }
  } else {
    resp.error = `method '${data.method} is not valid'`;
    status = 400;
  }

  res.status(status).json(resp);
}
