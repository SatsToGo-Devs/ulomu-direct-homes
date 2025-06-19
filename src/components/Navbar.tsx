
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "./UserProfile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-terracotta rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Ulomu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-terracotta font-medium">
              Home
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-terracotta font-medium">
              How It Works
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-terracotta font-medium">
                  Dashboard
                </Link>
                <Link to="/maintenance" className="text-gray-700 hover:text-terracotta font-medium">
                  Maintenance
                </Link>
                <Link to="/escrow" className="text-gray-700 hover:text-terracotta font-medium">
                  Escrow
                </Link>
                <Link to="/ai-insights" className="text-gray-700 hover:text-terracotta font-medium">
                  AI Insights
                </Link>
              </>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserProfile />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button className="bg-terracotta hover:bg-terracotta/90 text-white" asChild>
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-terracotta font-medium">
                Home
              </Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-terracotta font-medium">
                How It Works
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-terracotta font-medium">
                    Dashboard
                  </Link>
                  <Link to="/maintenance" className="text-gray-700 hover:text-terracotta font-medium">
                    Maintenance
                  </Link>
                  <Link to="/escrow" className="text-gray-700 hover:text-terracotta font-medium">
                    Escrow
                  </Link>
                  <Link to="/ai-insights" className="text-gray-700 hover:text-terracotta font-medium">
                    AI Insights
                  </Link>
                </>
              )}
              <div className="pt-4 space-y-2">
                {user ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {user.user_metadata?.first_name || user.email}
                    </span>
                    <UserProfile />
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button className="w-full bg-terracotta hover:bg-terracotta/90 text-white" asChild>
                      <Link to="/signup">Start Free Trial</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
