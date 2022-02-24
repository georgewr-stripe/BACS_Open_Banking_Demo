import React from "react";
import Link from "next/link";

export default function Success() {
  return (
    <>
      <h1>Thanks for donating to the Church</h1>
      <Link href="/">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5 content-center"
        >
          Back Home{" "}
        </button>
      </Link>
    </>
  );
}
