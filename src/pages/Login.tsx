
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Bot, ArrowRight } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-beige to-beige/50 flex items-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl border-beige/50">
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 bg-terracotta rounded-xl flex items-center justify-center mx-auto">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Welcome Back to Ulomu
                </CardTitle>
                <p className="text-gray-600">
                  Sign in to your AI-powered property maintenance dashboard
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className="border-beige focus:border-terracotta focus:ring-terracotta"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="border-beige focus:border-terracotta focus:ring-terracotta"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-beige" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-terracotta hover:text-terracotta/80">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button className="w-full bg-terracotta hover:bg-terracotta/90 text-white">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-beige" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-beige hover:bg-beige">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                    Google
                  </Button>
                  <Button variant="outline" className="border-beige hover:bg-beige">
                    <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" className="w-4 h-4 mr-2" />
                    Microsoft
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-terracotta hover:text-terracotta/80 font-medium">
                    Start your free trial
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
