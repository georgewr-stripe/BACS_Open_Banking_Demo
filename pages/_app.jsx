import '../tailwind.css'
import Header from "../components/header";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
    <Header />
      <div className="grid grid-cols-1 mt-10 mb-5 items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Component {...pageProps} />
          </div>
      </div>
    </div>
    </>
    )
}