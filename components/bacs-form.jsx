import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import Spinner from "./spinner";

const stripePromise = loadStripe(process.env.STRIPE_TEST_PUB_KEY);


export default function BACSForm({ handlePageChange, setupPayment, amount, billingPeriod, paymentLoading, setupIntentSecret }) {
  const terms =
    "I understand that Church has partnered with Stripe, who collects Direct Debits on behalf of Church and confirm that I am the account holder and the only person required to authorize debits from this account.";

  const [termsOK, setTermsOK] = React.useState(false);
  const [bacsInfo, setBacsInfo] = React.useState({
    name: '',
    email: '',
    sort_code: '',
    account_number: '',
    country: 'gb',
    street_address: '',
    city: '',
    county: '',
    postal_code: ''
  });
  const [editing, setEditing] = React.useState(true);

  const handleFormComplete = (e) => {
    if (e.preventDefault) e.preventDefault();
    setEditing(false);
    console.log('called')
  }

  const handleBacsSubmit = async () => {
    // First creater the setup intent in the backend
    const setupIntentSecret = await setupPayment({ create_setup_intent: true });
    // Then confirm the BACS details with stripe JS
    const stripe = await stripePromise;
    const { setupIntent, error } = await stripe.confirmBacsDebitSetup(
      setupIntentSecret,
      {
        payment_method: {
          billing_details: {
            address: {
              line1: bacsInfo.street_address,
              city: bacsInfo.city,
              country: bacsInfo.country,
              postal_code: bacsInfo.postal_code,
            },
            email: bacsInfo.email,
            name: bacsInfo.name,
          },
          bacs_debit: {
            account_number: bacsInfo.account_number,
            sort_code: bacsInfo.sort_code,
          },
        },
      },
    );

    // Lets create the subsctiption in the backend
    const resp = await setupPayment({ payment_method_id: setupIntent.payment_method });
    
    window.location.replace('/success')

  }

  const content = () => {
    console.log('content', editing)
    if (editing) {
      return (
        <form onSubmit={handleFormComplete} >
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6 ">
                <fieldset className=" col-span-6">
                  <legend className="block mb-1 text-sm font-medium text-gray-700">Account Holder Details</legend>
                  <div className="isolate -space-y-px rounded-md shadow-sm col-span-6 sm:col-span-4">
                    <div className="relative border border-gray-300 rounded-md rounded-b-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                      <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        required={true}
                        type="text"
                        value={bacsInfo.name}
                        onChange={(val) => setBacsInfo(info => ({ ...info, name: val.target.value }))}
                        name="name"
                        id="name"
                        className="block border-0 p-0 outline-none text-gray-900 placeholder-gray-500 sm:text-sm"
                      />
                    </div>
                    <div className="relative border border-gray-300 rounded-md rounded-t-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                      <label htmlFor="email" className="block w-full text-xs font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        required={true}
                        type="email"
                        value={bacsInfo.email}
                        onChange={(val) => setBacsInfo(info => ({ ...info, email: val.target.value }))}
                        name="email"
                        id="email"
                        className="block w-full border-0 p-0 outline-none text-gray-900 placeholder-gray-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </fieldset>
                <fieldset className=" col-span-6 ">
                  <legend className="block mb-1 text-sm font-medium text-gray-700">Bank Details</legend>
                  <div className="isolate -space-y-px rounded-md shadow-sm">
                    <div className="relative border border-gray-300 rounded-md rounded-b-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                      <label htmlFor="sort_code" className="block text-xs font-medium text-gray-700">
                        Sort Code
                      </label>
                      <input
                        required={true}
                        type="text"
                        value={bacsInfo.sort_code}
                        onChange={(val) => setBacsInfo(info => ({ ...info, sort_code: val.target.value }))}
                        name="sort_code"
                        id="sort_code"
                        className="block border-0 p-0 outline-none text-gray-900 placeholder-gray-500 sm:text-sm"
                      />
                    </div>
                    <div className="relative border border-gray-300 rounded-md rounded-t-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                      <label htmlFor="account_number" className="block w-full text-xs font-medium text-gray-700">
                        Account Number
                      </label>
                      <input
                        required={true}
                        type="text"
                        value={bacsInfo.account_number}
                        onChange={(val) => setBacsInfo(info => ({ ...info, account_number: val.target.value }))}
                        name="account_number"
                        id="account_number"
                        className="block w-full border-0 p-0 outline-none text-gray-900 placeholder-gray-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </fieldset>
                <fieldset className=" col-span-6 ">
                  <legend className="block mb-1 text-sm font-medium text-gray-700">Address</legend>
                  <div className="isolate -space-y-px rounded-md shadow-sm">
                    <div className="relative border border-gray-300 rounded-md rounded-b-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">

                      <select
                        id="country"
                        name="country"
                        value={bacsInfo.country}
                        onChange={(val) => setBacsInfo(info => ({ ...info, country: val.target.value }))}
                        className="outline-none block w-full py-2 px-3 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="gb">
                          United Kingdom
                        </option>
                      </select>
                    </div>

                    <div className="relative border border-gray-300 px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                      <label
                        htmlFor="street_address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street address
                      </label>
                      <input
                        type="text"
                        value={bacsInfo.street_address}
                        onChange={(val) => setBacsInfo(info => ({ ...info, street_address: val.target.value }))}
                        name="street_address"
                        id="street_address"
                        autoComplete="street_address"
                        className="outline-none mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="relative border border-gray-300 px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Town / City
                      </label>
                      <input
                        type="text"
                        value={bacsInfo.city}
                        onChange={(val) => setBacsInfo(info => ({ ...info, city: val.target.value }))}
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        className="outline-none mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex -space-x-p">
                      <div className=" w-1/2 flex-1 min-w-0 relative border border-gray-300 rounded-md rounded-t-none rounded-br-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                        <label
                          htmlFor="county"
                          className="block text-sm font-medium text-gray-700"
                        >
                          County
                        </label>
                        <input
                          type="text"
                          name="county"
                          value={bacsInfo.county}
                          onChange={(val) => setBacsInfo(info => ({ ...info, county: val.target.value }))}
                          id="county"
                          autoComplete="address-level1"
                          className="outline-none mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full  sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="w-1/2 flex-1 min-w-0 relative border border-gray-300 rounded-md rounded-t-none rounded-bl-none border-l-0 px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                        <label
                          htmlFor="postal_code"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Postal code
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          id="postal_code"
                          value={bacsInfo.postal_code}
                          onChange={(val) => setBacsInfo(info => ({ ...info, postal_code: val.target.value }))}
                          autoComplete="postal_code"
                          className="outline-none mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full  sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="relative flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms-description"
                    name="terms"
                    type="checkbox"
                    value={termsOK}
                    checked={termsOK}
                    onChange={() => setTermsOK(!termsOK)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <p id="terms-description" className="text-gray-500">
                    {terms}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 disabled:bg-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={!termsOK}
              >
                Save
              </button>
            </div>
          </div>
        </form>)

    } else {

      return (
        <div className="flex flex-col items-end">
          <button onClick={() => setEditing(true)} className="text-sm mt-3 font-medium text-indigo-600 float-right ">Modify</button>

          <div className="mt-2 border border-gray-400 bg-gray-100 p-3 rounded-lg w-full">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-2 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{bacsInfo.name}</dd>
              </div>
              <div className="py-2 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{bacsInfo.email}</dd>
              </div>
              <div className="py-2 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Sort Code</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{bacsInfo.sort_code}</dd>
              </div>
              <div className="py-2 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">{bacsInfo.account_number}</dd>
              </div>
            </dl>
          </div>
          <div className="text-sm mt-3 font-medium text-gray-500" >
            You will receive two days advance notice of any amount to be debited under this instruction.
            Payments will show as 'Church' on your bank statement. After you complete the setup,
            an email confirmation will be sent to {bacsInfo.email} within 3 business days.
          </div>
          <button
            type="button"
            disabled={paymentLoading}
            onClick={() => handleBacsSubmit()}
            className="inline-flex justify-center mt-5 w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 disabled:bg-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {paymentLoading ? <Spinner /> : 'Setup Direct Debit'}
          </button>
        </div>
      )
    }
  }

  return (
    <>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1 flex flex-col justify-between">
            <div className="px-4 sm:px-0n">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                BACS Direct Debit Information
              </h3>
              <p className="mt-3 text-sm text-gray-500">
                Your payments are protected by the {" "}
                <a href="https://stripe.com/bacs_debit/direct-debit-guarantee" className="text-blue-500" target="_blank">
                  Direct Debit Guarentee
                </a>
              </p>
              <p className="mt-3 text-sm text-gray-500">
                Church
                <br />
                Trafalgar Sq
                <br />
                London
                <br />
                WC2N 5DN
              </p>
              <a className="mt-1 text-sm text-blue-500" href="mailto:support@support.com">support@support.com</a>
              <img className="mt-2" style={{ height: "50px", opacity: "0.5" }} src="https://www.bacs.co.uk/SiteCollectionImages/BacsLogos/DirectDebitLogo.jpg" />
            </div>
            <div className="px-4 sm:px-0n">
              <span className="text-xl font-large leading-6 text-gray-900">
                {`${new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(amount))} ${billingPeriod.title} Donation`}
              </span>
            </div>
            <div>
              <button
                type="button"
                onClick={() => handlePageChange(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5"
              >
                Back
              </button>
            </div>

          </div>

          <div className="mt-5 md:mt-0 md:col-span-2">
            {content()}
          </div>
        </div>
      </div>
    </>
  );


}
