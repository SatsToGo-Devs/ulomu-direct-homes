
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { FileText, Download, Send } from "lucide-react";

interface InvoiceGeneratorProps {
  tenantName?: string;
  tenantEmail?: string;
  propertyAddress?: string;
  rentAmount?: number;
  rentPeriod?: string;
}

const InvoiceGenerator = ({
  tenantName = "",
  tenantEmail = "",
  propertyAddress = "",
  rentAmount = 0,
  rentPeriod = ""
}: InvoiceGeneratorProps) => {
  const [invoice, setInvoice] = useState({
    tenantName: tenantName,
    tenantEmail: tenantEmail,
    propertyAddress: propertyAddress,
    rentAmount: rentAmount,
    rentPeriod: rentPeriod,
    dueDate: "",
    additionalDetails: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoice({
      ...invoice,
      [name]: value
    });
  };

  const handleGenerateInvoice = () => {
    // In a real app, this would connect to the Supabase backend
    alert("Invoice generated and sent to tenant");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Rent Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tenantName">Tenant Name</Label>
            <Input
              id="tenantName"
              name="tenantName"
              value={invoice.tenantName}
              onChange={handleChange}
              placeholder="Enter tenant name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenantEmail">Tenant Email</Label>
            <Input
              id="tenantEmail"
              name="tenantEmail"
              type="email"
              value={invoice.tenantEmail}
              onChange={handleChange}
              placeholder="Enter tenant email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyAddress">Property Address</Label>
          <Input
            id="propertyAddress"
            name="propertyAddress"
            value={invoice.propertyAddress}
            onChange={handleChange}
            placeholder="Enter property address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rentAmount">Rent Amount (₦)</Label>
            <Input
              id="rentAmount"
              name="rentAmount"
              type="number"
              value={invoice.rentAmount || ""}
              onChange={handleChange}
              placeholder="Enter rent amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rentPeriod">Rent Period</Label>
            <Input
              id="rentPeriod"
              name="rentPeriod"
              value={invoice.rentPeriod}
              onChange={handleChange}
              placeholder="e.g., January 2023 - December 2023"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={invoice.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalDetails">Additional Details</Label>
          <Textarea
            id="additionalDetails"
            name="additionalDetails"
            value={invoice.additionalDetails}
            onChange={handleChange}
            placeholder="Enter any additional details or payment instructions"
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Preview
        </Button>
        <Button onClick={handleGenerateInvoice} className="bg-terracotta hover:bg-terracotta/90 gap-2">
          <Send className="h-4 w-4" />
          Generate & Send
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceGenerator;
