
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home, 
  Building, 
  Users, 
  Wrench, 
  Brain,
  MessageCircle,
  TestTube,
  CreditCard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Properties", path: "/properties", icon: Building },
    { name: "Tenants", path: "/tenants", icon: Users },
    { name: "Maintenance", path: "/maintenance", icon: Wrench },
    { name: "AI Features", path: "/ai-insights", icon: Brain },
    { name: "Chat Assistant", path: "/chat-assistant", icon: MessageCircle },
    { name: "System Test", path: "/system-test", icon: TestTube },
    { name: "Escrow", path: "/escrow", icon: CreditCard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-beige/30 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-terracotta to-forest rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-bold text-xl text-forest dark:text-white">Ulomu</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-terracotta text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-beige/50 dark:hover:bg-gray-700 hover:text-terracotta dark:hover:text-terracotta"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate("/signup")} className="bg-terracotta hover:bg-terracotta/90">
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {user && (
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-beige/30 dark:border-gray-700">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-terracotta text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-beige/50 dark:hover:bg-gray-700 hover:text-terracotta dark:hover:text-terracotta"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
