import Link from 'next/link';

export default function CallToActionSection() {
  return (
    <section className="py-16 md:py-24 bg-blue-600 text-white text-center px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Ready to Simplify Your Trip Logging?
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Experience the speed and accuracy of AI-powered record-keeping. Get started in seconds.
        </p>
        <Link
          href="/mvp"
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Try Trip Log AI Now!
        </Link>
      </div>
    </section>
  );
}