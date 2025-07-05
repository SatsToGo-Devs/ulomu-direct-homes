import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UlomuLogo from "./UlomuLogo";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, Shield, Brain } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const { isAdmin, isLandlord, getPrimaryRole } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getDashboardLink = () => {
    const primaryRole = getPrimaryRole();
    switch (primaryRole) {
      case 'admin':
        return '/admin-dashboard';
      case 'landlord':
        return '/landlord-dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <UlomuLogo />
            </Link>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <ThemeToggle />
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="text-gray-700 dark:text-gray-300 hover:text-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  {isLandlord() && (
                    <Link
                      to="/properties"
                      className="text-gray-700 dark:text-gray-300 hover:text-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Properties
                    </Link>
                  )}
                  {isAdmin() && (
                    <Link
                      to="/admin-dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="text-gray-700 dark:text-gray-300 hover:text-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Profile
                  </Link>
                  {user && (
                    <Link
                      to="/ai-hub"
                      className="text-gray-500 hover:text-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Brain className="h-4 w-4" />
                      AI Hub
                    </Link>
                  )}
                  <Button onClick={handleSignOut} variant="outline">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/how-it-works"
                    className="text-gray-700 dark:text-gray-300 hover:text-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    How It Works
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-terracotta hover:bg-terracotta/90">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-terracotta hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-terracotta"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="text-gray-700 dark:text-gray-300 hover:text-terracotta block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isLandlord() && (
                    <Link
                      to="/properties"
                      className="text-gray-700 dark:text-gray-300 hover:text-terracotta block px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Properties
                    </Link>
                  )}
                  {isAdmin() && (
                    <Link
                      to="/admin-dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-terracotta block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="text-gray-700 dark:text-gray-300 hover:text-terracotta block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="px-3 py-2">
                    <Button onClick={handleSignOut} variant="outline" className="w-full">
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/how-it-works"
                    className="text-gray-700 dark:text-gray-300 hover:text-terracotta block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <div className="px-3 py-2 space-y-2">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="bg-terracotta hover:bg-terracotta/90 w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
