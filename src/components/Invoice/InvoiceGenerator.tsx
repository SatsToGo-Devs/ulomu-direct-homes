
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, FileText, Download, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceCharge {
  id: string;
  description: string;
  amount: number;
}

interface InvoiceGeneratorProps {
  unitId: string;
  tenantId: string;
  rentAmount?: number;
}

export default function InvoiceGenerator({ unitId, tenantId, rentAmount = 0 }: InvoiceGeneratorProps) {
  const [invoice, setInvoice] = useState({
    unitId,
    tenantId,
    dueDate: new Date().toISOString().split('T')[0],
    items: [{ description: 'Monthly Rent', amount: rentAmount }],
    amount: rentAmount
  });
  
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch service charges for this unit
  useEffect(() => {
    const fetchServiceCharges = async () => {
      try {
        const response = await fetch(`/api/landlord/service-charges?unitId=${unitId}`);
        if (response.ok) {
          const data = await response.json();
          setServiceCharges(data);
        }
      } catch (error) {
        console.error('Error fetching service charges:', error);
      }
    };

    fetchServiceCharges();
  }, [unitId]);

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        { description: '', amount: 0 }
      ]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...invoice.items];
    newItems.splice(index, 1);
    
    setInvoice({
      ...invoice,
      items: newItems,
      amount: calculateTotal(newItems)
    });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...invoice.items];
    
    if (field === 'amount') {
      newItems[index] = { 
        ...newItems[index], 
        [field]: parseFloat(value) || 0 
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    
    setInvoice({
      ...invoice,
      items: newItems,
      amount: calculateTotal(newItems)
    });
  };

  const calculateTotal = (items = invoice.items) => {
    return items.reduce((sum, item) => sum + (parseFloat(item.amount.toString()) || 0), 0);
  };

  const addServiceCharge = (charge: ServiceCharge) => {
    const newItems = [
      ...invoice.items,
      { description: charge.description, amount: charge.amount }
    ];
    
    setInvoice({
      ...invoice,
      items: newItems,
      amount: calculateTotal(newItems)
    });
  };

  const generateInvoice = async () => {
    if (invoice.items.some(item => !item.description || !item.amount)) {
      toast.error('Please fill in all item details');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId: invoice.unitId,
          tenantId: invoice.tenantId,
          amount: invoice.amount,
          dueDate: invoice.dueDate,
          items: invoice.items.map(item => ({
            description: item.description,
            amount: item.amount
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Invoice generated successfully');
        
        // Reset form to initial state except for IDs
        setInvoice({
          unitId,
          tenantId,
          dueDate: new Date().toISOString().split('T')[0],
          items: [{ description: 'Monthly Rent', amount: rentAmount }],
          amount: rentAmount
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={invoice.dueDate}
            onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Invoice Items</Label>
            <Button type="button" size="sm" variant="outline" onClick={addItem} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    {index > 0 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="text-right font-bold">
                  Total Amount
                </TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {serviceCharges.length > 0 && (
          <div className="space-y-2">
            <Label>Add Service Charges</Label>
            <div className="grid grid-cols-2 gap-2">
              {serviceCharges.map((charge) => (
                <Button
                  key={charge.id}
                  type="button"
                  variant="outline"
                  className="justify-between"
                  onClick={() => addServiceCharge(charge)}
                >
                  <span>{charge.description}</span>
                  <span>${charge.amount.toFixed(2)}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={isLoading} className="gap-2">
          <Download className="h-4 w-4" />
          Preview
        </Button>
        <Button onClick={generateInvoice} disabled={isLoading} className="gap-2">
          <Send className="h-4 w-4" />
          Generate & Send
        </Button>
      </CardFooter>
    </Card>
  );
}
