
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-terracotta flex items-center justify-center">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          <span className="font-bold text-xl text-terracotta">Ulomu</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-terracotta font-medium">
            Home
          </Link>
          <Link to="/properties" className="text-gray-600 hover:text-terracotta font-medium">
            Properties
          </Link>
          <Link to="/how-it-works" className="text-gray-600 hover:text-terracotta font-medium">
            How It Works
          </Link>
          <div className="pl-4 flex space-x-2">
            <Button variant="outline">Sign In</Button>
            <Button className="bg-terracotta hover:bg-terracotta/90">
              Sign Up
            </Button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-terracotta font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className="text-gray-600 hover:text-terracotta font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Properties
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-gray-600 hover:text-terracotta font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline">Sign In</Button>
              <Button className="bg-terracotta hover:bg-terracotta/90">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
