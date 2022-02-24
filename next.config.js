/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    STRIPE_PUB_KEY: process.env.STRIPE_PUB_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_TEST_PUB_KEY: process.env.STRIPE_TEST_PUB_KEY,
    STRIPE_TEST_SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY,
  }
}