
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar } from "lucide-react";

interface LandlordCardProps {
  landlord: {
    name: string;
    joinedDate: string;
    responseRate: string;
    verified: boolean;
  };
}

const LandlordCard = ({ landlord }: LandlordCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-3">Landlord Information</h3>
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
            {landlord.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{landlord.name}</p>
            <p className="text-sm text-gray-600">Member since {landlord.joinedDate}</p>
          </div>
          {landlord.verified && (
            <Badge className="ml-auto bg-forest">Verified</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">Response rate: {landlord.responseRate}</p>
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-terracotta hover:bg-terracotta/90 flex items-center gap-2">
            <MessageCircle size={18} />
            Contact
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar size={18} />
            Book Visit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandlordCard;
