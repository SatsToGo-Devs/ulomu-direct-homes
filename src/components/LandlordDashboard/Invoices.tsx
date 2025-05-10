
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const Invoices = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Invoices</CardTitle>
          <Button>Create New Invoice</Button>
        </div>
        <CardDescription>Generate and manage rent invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <FileText className="mx-auto h-12 w-12 mb-4" />
          <p>No invoices generated yet.</p>
          <p className="mt-2">Use the button above to create your first invoice.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Invoices;
