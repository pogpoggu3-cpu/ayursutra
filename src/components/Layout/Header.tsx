import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-sage-100 rounded-lg">
              <Leaf className="w-8 h-8 text-sage-600" />
            </div>
            <span className="text-2xl font-serif font-bold text-charcoal">AyurSutra</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-charcoal hover:text-sage-600 transition-colors">
              Features
            </Link>
            <Link to="/#for-doctors" className="text-charcoal hover:text-sage-600 transition-colors">
              For Doctors
            </Link>
            <Link to="/#for-patients" className="text-charcoal hover:text-sage-600 transition-colors">
              For Patients
            </Link>
            <Link to="/#contact" className="text-charcoal hover:text-sage-600 transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={`/${user?.role}-dashboard`}
                  className="flex items-center space-x-2 text-charcoal hover:text-sage-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-charcoal hover:text-sage-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-charcoal hover:text-sage-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/demo"
                  className="px-4 py-2 border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-all duration-300 rounded-lg font-medium"
                >
                  Book a Demo
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-charcoal hover:text-sage-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link to="/#features" className="text-charcoal hover:text-sage-600 transition-colors">
                Features
              </Link>
              <Link to="/#for-doctors" className="text-charcoal hover:text-sage-600 transition-colors">
                For Doctors
              </Link>
              <Link to="/#for-patients" className="text-charcoal hover:text-sage-600 transition-colors">
                For Patients
              </Link>
              <Link to="/#contact" className="text-charcoal hover:text-sage-600 transition-colors">
                Contact Us
              </Link>
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  <Link 
                    to={`/${user?.role}-dashboard`}
                    className="flex items-center space-x-2 text-charcoal hover:text-sage-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-charcoal hover:text-sage-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  <Link to="/login" className="text-charcoal hover:text-sage-600 transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/demo"
                    className="px-4 py-2 border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-all duration-300 rounded-lg font-medium text-center"
                  >
                    Book a Demo
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;