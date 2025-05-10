
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InquiryForm = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-3">Interested in this property?</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded-md"
              placeholder="Your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input 
              type="tel" 
              className="w-full p-2 border rounded-md"
              placeholder="Your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              className="w-full p-2 border rounded-md"
              rows={4}
              placeholder="I'm interested in this property and would like more information..."
            ></textarea>
          </div>
          <Button className="w-full bg-terracotta hover:bg-terracotta/90">
            Send Inquiry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InquiryForm;
