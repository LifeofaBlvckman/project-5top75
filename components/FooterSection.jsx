export default function FooterSection() {
  return (
    <footer className="py-10 bg-gray-800 text-white text-center text-sm px-4">
      <div className="max-w-6xl mx-auto">
        <p>&copy; {new Date().getFullYear()} Trip Log AI. All rights reserved.</p>
        <p className="mt-2 text-gray-400">
          <a href="#" className="hover:underline">Privacy Policy</a> &bull; <a href="#" className="hover:underline">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}