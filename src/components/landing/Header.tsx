
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Heart } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-sm py-4'
    }`}>
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-blood-DEFAULT p-2 rounded-full">
            <Heart className="h-6 w-6 text-white fill-current" />
          </div>
          <span className="text-xl font-bold text-gray-800">Sundas Foundation</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('help')}
            className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium"
          >
            How to Help
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium"
          >
            Contact
          </button>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button className="bg-blood-DEFAULT hover:bg-blood-dark text-white px-6 py-2 rounded-full font-semibold">
            Donate Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
            <div className="flex flex-col p-4 gap-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium text-left"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('help')}
                className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium text-left"
              >
                How to Help
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blood-DEFAULT transition-colors font-medium text-left"
              >
                Contact
              </button>
              <Button className="bg-blood-DEFAULT hover:bg-blood-dark text-white px-6 py-2 rounded-full font-semibold w-full">
                Donate Now
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
