import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-1 w-full px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
