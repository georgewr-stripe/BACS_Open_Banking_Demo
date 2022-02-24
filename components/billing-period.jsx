import React from 'react';

import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/solid";

export default function BillingPeriod({billingPeriods, billingPeriod, setBillingPeriod, handlePageChange}) {
  
  function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
  
  
  return (<div>
          <RadioGroup value={billingPeriod} onChange={setBillingPeriod}>
            <RadioGroup.Label className="text-base font-medium text-gray-900">
              How often woud you like to donate?
            </RadioGroup.Label>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
              {billingPeriods.map((period) => (
                <RadioGroup.Option
                  key={period.id}
                  value={period}
                  className={({ checked, active }) =>
                    classNames(
                      checked ? "border-transparent" : "border-gray-300",
                      active ? "ring-2 ring-indigo-500" : "",
                      "relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none"
                    )
                  }
                >
                  {({ checked, active }) => (
                    <>
                      <div className="flex-1 flex">
                        <div className="flex flex-col">
                          <RadioGroup.Label
                            as="span"
                            className="block text-sm font-medium text-gray-900"
                          >
                            {period.title}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className="mt-1 flex items-center text-sm text-gray-500"
                          >
                            {period.description}
                          </RadioGroup.Description>
                          <RadioGroup.Description
                            as="span"
                            className="mt-6 text-sm font-medium text-gray-900"
                          >
                            {period.sub}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      <CheckCircleIcon
                        className={classNames(
                          !checked ? "invisible" : "",
                          "h-5 w-5 text-indigo-600"
                        )}
                        aria-hidden="true"
                      />
                      <div
                        className={classNames(
                          active ? "border" : "border-2",
                          checked ? "border-indigo-500" : "border-transparent",
                          "absolute -inset-px rounded-lg pointer-events-none"
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        <button
          type="button"
          onClick={() => handlePageChange(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5 float-right"
        >
          Next
        </button>
      </div>)
}