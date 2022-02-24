import React from 'react';

export default function BillingAmount({amount, setAmount, handlePageChange}) {
  
  
  
  return (
  <div>
        <label
          htmlFor="price"
          className="block text-lg font-medium text-gray-700"
        >
          Donation Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg">£</span>
          </div>
          <input
            type="number"
            name="price"
            id="price"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 text-lg border-gray-300 rounded-md"
            placeholder="10.00"
            aria-describedby="price-currency"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg" id="price-currency">
              GBP
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handlePageChange(false)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5 float-right"
        >
        Next
        </button>
      </div>
  )
}