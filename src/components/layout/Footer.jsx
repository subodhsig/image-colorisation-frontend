import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="w-full px-6 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">

        <div>
          <h3 className="font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/services/colorization" className="hover:underline">AI Image Colorization</Link></li>
            <li><Link to="/services/upscaling" className="hover:underline">Image Upscaling</Link></li>
            <li><Link to="/services/restoration" className="hover:underline">Photo Restoration</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">How to Use</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/how-to-use" className="hover:underline">Quick Start Guide</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link to="/support" className="hover:underline">Support</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Social</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="#" className="hover:underline">Twitter / X</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 pb-6">
        © {new Date().getFullYear()} Image colorization — All rights reserved.
      </div>
    </footer>
  );
}
