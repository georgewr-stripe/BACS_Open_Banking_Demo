import React from "react";

export default function OpenBankingQR({ url }) {
  return (
    <>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Payment QR Code
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Scan this code on your phone and follow the steps to complete
                the payment in your banking app.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <img src={url} />
            <a href="/">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5 float-right"
              >
                Back Home
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
