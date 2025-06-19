
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Check } from "lucide-react";

interface PhoneAuthProps {
  onSuccess?: () => void;
}

const PhoneAuth = ({ onSuccess }: PhoneAuthProps) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithPhone, verifyOtp } = useAuth();
  const { toast } = useToast();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsLoading(true);
    try {
      const { error } = await signInWithPhone(phone);
      
      if (error) {
        toast({
          title: "Error sending OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsOtpSent(true);
        toast({
          title: "OTP sent!",
          description: "Please check your phone for the verification code.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    try {
      const { error } = await verifyOtp(phone, otp);
      
      if (error) {
        toast({
          title: "Invalid OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "You have been signed in successfully.",
        });
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isOtpSent) {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            className="border-beige focus:border-terracotta focus:ring-terracotta"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-terracotta hover:bg-terracotta/90 text-white"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
          <Check className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost"
          onClick={() => setIsOtpSent(false)}
          className="w-full"
        >
          Use different phone number
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="border-beige focus:border-terracotta focus:ring-terracotta"
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !phone}
        className="w-full bg-terracotta hover:bg-terracotta/90 text-white"
      >
        {isLoading ? "Sending..." : "Send Verification Code"}
        <Phone className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
};

export default PhoneAuth;
