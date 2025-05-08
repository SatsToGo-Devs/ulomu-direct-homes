
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface RentSavingsProps {
  targetAmount?: number;
  currentAmount?: number;
}

const RentSavings = ({
  targetAmount = 1500000, // Default ₦1,500,000
  currentAmount = 750000, // Default ₦750,000 (50%)
}: RentSavingsProps) => {
  const [amount, setAmount] = useState("");
  const progress = Math.round((currentAmount / targetAmount) * 100);

  const handleSaveAmount = () => {
    // In a real app, this would connect to the Supabase backend to process the payment
    alert(`Adding ₦${parseInt(amount).toLocaleString()} to your rent savings`);
    setAmount("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rent Savings Plan</CardTitle>
        <CardDescription>
          Save towards your next rent payment gradually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Target: ₦{targetAmount.toLocaleString()}</span>
            <span>Saved: ₦{currentAmount.toLocaleString()}</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="text-right text-sm text-gray-500 mt-1">
            {progress}% complete
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="save-amount">Add to your savings</Label>
          <div className="flex gap-2">
            <Input
              id="save-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button 
              onClick={handleSaveAmount} 
              disabled={!amount || parseFloat(amount) <= 0}
              className="bg-forest hover:bg-forest/90"
            >
              Add Funds
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-md">
          <h4 className="font-semibold mb-2">Savings Tips</h4>
          <ul className="text-sm space-y-1">
            <li>• Set aside a small amount each week</li>
            <li>• Automatic deposits help build consistency</li>
            <li>• All funds are securely held in escrow</li>
            <li>• Withdraw anytime or pay directly to landlord</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Withdrawal History</Button>
        <Button className="bg-terracotta hover:bg-terracotta/90">Pay Rent</Button>
      </CardFooter>
    </Card>
  );
};

export default RentSavings;
