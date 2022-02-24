import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.STRIPE_PUB_KEY);

import { useState } from "react";

import BillingPeriod from "../components/billing-period";
import BillingAmount from "../components/billing-amount";
import PaymentMethod from "../components/payment-method";
import BankTransfer from "../components/bank-transfer";
import BACSForm from "../components/bacs-form";
import OpenBankingQR from "../components/open-banking-qr";

const billingPeriods = [
  {
    id: 1,
    title: "One-Off",
    description: "We appreciate your donation",
    sub: "",
    value: "once",
  },
  {
    id: 2,
    title: "Monthly",
    description: "For very generous folks",
    sub: "Most Popular",
    value: "month",
  },
  {
    id: 3,
    title: "Annualy",
    description: "For pretty generous folks",
    sub: "",
    value: "year",
  },
];

const paymentMethods = [
  {
    id: 1,
    title: "BACS",
    description: "BACS Transfer direct from your bank",
    sub: "Checkout Version",
    value: "bacs_debit",
  },
  {
    id: 2,
    title: "BACS",
    description: "BACS Transfer direct from your bank",
    sub: "Embedded Version",
    value: "bacs_debit_embedded",
  },
  {
    id: 3,
    title: "Open Banking",
    description: "Open Banking - using your banking app",
    sub: "Redirect Version",
    value: "pay_by_bank",
  },
  {
    id: 4,
    title: "Open Banking",
    description: "Open Banking - using your banking app",
    sub: "QR Code Version",
    value: "pay_by_bank_qr",
  },
];

const pages = {
  billing_period: 0,
  billing_amount: 1,
  payment_method: 2,
  bacs_form: 3
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Index() {

  const [page, setPage] = useState(pages.billing_period);
  const [billingPeriod, setBillingPeriod] = useState(billingPeriods[0]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [amount, setAmount] = useState(10.0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [bankRedirectURL, setBankRedirectURL] = useState(null);

  async function setupPayment(additionalPayload = {}) {
    setPaymentLoading(true);
    setBankRedirectURL(null);
    // POST the payment information back to the server
    const resp = await fetch("/api/setup-payment", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        period: billingPeriod.value,
        amount: amount,
        method: paymentMethod.value,
        ...additionalPayload
      }),
    });
    const data = await resp.json();

    // Check for a redirect
    if (data.redirect_url) {
      setBankRedirectURL(data.redirect_url);
    }
    // This is for the embedded BACS - need to confirm the setup intent
    if (data.setup_intent_client_secret) {
      return data.setup_intent_client_secret
    }
    setPaymentLoading(false);
  }

  const handlePageChange = (direction) => {
    // Handle navigating through the payment pages
    const requestedPage = page + (direction ? 1 : -1);
    setPage(requestedPage);
  };

  if (page == pages.billing_period) {
    // Billing Period Section
    return (
      <BillingPeriod
        billingPeriods={billingPeriods}
        billingPeriod={billingPeriod}
        setBillingPeriod={setBillingPeriod}
        handlePageChange={handlePageChange}
      />
    );
  }

  if (page == pages.billing_amount) {
    // Billing Amount Section
    return (
      <BillingAmount
        amount={amount}
        setAmount={setAmount}
        handlePageChange={handlePageChange}
      />
    );
  }

  if (page == pages.payment_method) {
    // Payment Method Section
    if (!bankRedirectURL) {
      // Loading Payment Intent Show Spinner if loading
      return (
        <PaymentMethod
          paymentMethods={paymentMethods}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          handlePageChange={handlePageChange}
          paymentLoading={paymentLoading}
          billingPeriod={billingPeriod}
          setupPayment={setupPayment}
        />
      );
    } else {
      // We have the bank redirect URL
      if (paymentMethod.value == "pay_by_bank_qr") {
        // Use the QR code 
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
          bankRedirectURL
        )}`;
        return (<OpenBankingQR url={url} />)
      } else {
        // Redirect the user to complete the payment
        window.location.replace(bankRedirectURL);
      }
    }
  }

  if (page == pages.bacs_form && paymentMethod.value == "bacs_debit_embedded") {
    // BACS Form
    return <BACSForm handlePageChange={handlePageChange} setupPayment={setupPayment} amount={amount} billingPeriod={billingPeriod} paymentLoading={paymentLoading} />;
  }
}
