import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-16 md:py-24 bg-white text-center px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
          Trip Log AI: Effortless Work Trip Logging
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop manual entry. Trip Log AI simplifies record-keeping by extracting key trip details from your simple text descriptions.
        </p>
        <Link
          href="/mvp"
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Start Logging Now
        </Link>
      </div>
    </section>
  );
}