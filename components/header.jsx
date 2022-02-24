import React from 'react';

export default function Header() {
  return (
    <header className="bg-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-gray-200 lg:border-none">
          <div className="flex items-center">
            <a href="/">
              <span className="sr-only">Workflow</span>
              <img
                className="h-20 w-auto"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png"
                alt=""
              />
            </a>
        </div>
        </div>
      </nav>
    </header>
  )
}