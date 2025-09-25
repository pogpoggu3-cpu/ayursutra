import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-sage-600 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-serif font-bold">AyurSutra</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bridging ancient Ayurvedic wisdom with modern AI technology for 
              intelligent Panchakarma management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/#features" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-gray-400 hover:text-sage-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Book Demo
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Users</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Doctor Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Patient Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Therapist Login
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-sage-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-sage-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Facebook className="w-5 h-5 text-gray-400 hover:text-sage-400 cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-gray-400 hover:text-sage-400 cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 text-gray-400 hover:text-sage-400 cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 text-gray-400 hover:text-sage-400 cursor-pointer transition-colors" />
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 AyurSutra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;