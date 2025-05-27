import { Instagram, Linkedin, Facebook, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-5 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Navigations */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigations</h3>
            <ul className="space-y-3">
              <li><a href="#" className="transition-colors">Home</a></li>
              <li><a href="#" className="transition-colors">Categories</a></li>
              <li><a href="#" className="transition-colors">Special</a></li>
              <li><a href="#" className="transition-colors">Contact</a></li>
              <li><a href="#" className="transition-colors">About</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-3">
              <li><a href="#" className="transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="transition-colors">Refund Policy</a></li>
              <li><a href="#" className="transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="transition-colors">Contact</a></li>
            </ul>

            {/* Social Media Icons */}
            <div className="mt-8">
              <div className="flex space-x-3">
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
                  <Instagram className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
                  <Linkedin className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
                  <Facebook className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
                  <Twitter className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
                  <MessageCircle className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-6">
          <p className="text-black text-sm">
            © 2024, Hugsy Finds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}