import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import Logo from '../ui/Logo';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const JessicaNav: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  // Navigation simplifiée selon les requirements Jessica - 4 sections principales
  const navigationItems = [
    { label: 'Home', to: '/', match: /^\/$/ },
    { label: 'Stories', to: '/blog', match: /^\/blog/ },
    { label: 'Gallery', to: '/gallery', match: /^\/gallery/ },
    { label: 'Contact', to: '/contact', match: /^\/contact/ }
  ];

  const isActive = (item: typeof navigationItems[0]) => {
    return item.match.test(location.pathname);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-[#f4a6a9]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand - Educate for Dignity avec mission Jessica */}
          <Link to="/" className="flex flex-col items-start">
            <Logo size="md" className="flex items-center" />
            <div className="text-[9px] sm:text-[10px] md:text-[11px] text-[#7a6a67] font-medium mt-0.5 leading-tight">
              "Breaking taboos, restoring dignity" - Jessica
            </div>
          </Link>

          {/* Desktop Navigation - Navigation simplifiée */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`font-medium transition-colors ${
                  isActive(item)
                    ? 'text-[#f4a6a9] font-semibold'
                    : 'text-[#7a6a67] hover:text-[#f4a6a9]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Login Button */}
            <Link 
              to="/login" 
              className="text-[#7a6a67] hover:text-[#f4a6a9] font-medium transition-colors px-3 py-2"
            >
              Login
            </Link>
            
            {/* Support CTA - Principal appel à l'action */}
            <Link 
              to="/support" 
              className="bg-[#f4a6a9] text-white px-6 py-2 rounded-full hover:bg-[#e89396] transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Support My Work
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#7a6a67] hover:text-[#f4a6a9] rounded-md"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Navigation mobile responsive */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-[#f4a6a9]/20 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive(item)
                    ? 'bg-[#f4a6a9]/10 text-[#f4a6a9] font-semibold border border-[#f4a6a9]/30'
                    : 'text-[#7a6a67] hover:text-[#f4a6a9] hover:bg-[#f4a6a9]/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Language Switcher */}
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
            
            {/* Mobile Login Button */}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block mx-4 px-4 py-3 text-[#7a6a67] hover:text-[#f4a6a9] hover:bg-[#f4a6a9]/5 rounded-lg font-medium transition-colors text-center border border-[#f4a6a9]/20"
            >
              Login
            </Link>
            
            {/* Mobile Support Button */}
            <Link
              to="/support"
              onClick={() => setIsOpen(false)}
              className="block mx-4 mt-4 px-6 py-3 bg-[#f4a6a9] text-white rounded-full hover:bg-[#e89396] transition-colors text-center font-medium shadow-md"
            >
              Support My Work
            </Link>

            {/* WhatsApp Assistant Info - Selon requirements */}
            <div className="mx-4 mt-6 p-4 bg-[#f5e6d3] rounded-lg border border-[#f4a6a9]/20">
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-[#f4a6a9] mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-[#5a4a47] mb-1">Need Support?</p>
                  <p className="text-[#7a6a67] text-xs leading-relaxed">
                    Chat with our assistant or reach me on WhatsApp for verified information 
                    about menstrual health and education support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default JessicaNav;