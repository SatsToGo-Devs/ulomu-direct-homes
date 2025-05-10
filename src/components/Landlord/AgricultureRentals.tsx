
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FarmRental {
  id: string;
  farmingPurpose: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  status: string;
  farmer: {
    name: string;
    email: string;
    phone: string;
    farmingType: string;
  };
}

interface FarmerUser {
  id: string;
  name: string;
  email: string;
  farmingType: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  size: number;
  soilType: string;
  waterSource: string;
  propertyType: string;
}

export default function AgricultureRentals() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('properties');
  const [agriculturalProperties, setAgriculturalProperties] = useState<Property[]>([]);
  const [farmRentals, setFarmRentals] = useState<FarmRental[]>([]);
  const [farmers, setFarmers] = useState<FarmerUser[]>([]);
  
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    size: '',
    soilType: '',
    waterSource: ''
  });
  
  const [newRental, setNewRental] = useState({
    propertyId: '',
    farmerId: '',
    startDate: '',
    endDate: '',
    rentAmount: '',
    farmingPurpose: ''
  });

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/landlord/properties?type=AGRICULTURAL');
      if (response.ok) {
        const data = await response.json();
        setAgriculturalProperties(data);
      }
    } catch (error) {
      console.error('Error fetching agricultural properties:', error);
    }
  };

  const fetchFarmRentals = async () => {
    try {
      const response = await fetch('/api/landlord/farm-rentals');
      if (response.ok) {
        const data = await response.json();
        setFarmRentals(data);
      }
    } catch (error) {
      console.error('Error fetching farm rentals:', error);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await fetch('/api/landlord/farmers');
      if (response.ok) {
        const data = await response.json();
        setFarmers(data);
      }
    } catch (error) {
      console.error('Error fetching farmers:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchFarmRentals();
    fetchFarmers();
  }, []);

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/landlord/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProperty,
          size: parseFloat(newProperty.size),
          propertyType: 'AGRICULTURAL'
        })
      });

      if (response.ok) {
        toast.success('Agricultural property added successfully');
        setNewProperty({
          name: '',
          address: '',
          size: '',
          soilType: '',
          waterSource: ''
        });
        fetchProperties();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleRentalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/landlord/farm-rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRental,
          rentAmount: parseFloat(newRental.rentAmount),
          startDate: new Date(newRental.startDate).toISOString(),
          endDate: new Date(newRental.endDate).toISOString()
        })
      });

      if (response.ok) {
        toast.success('Land rental agreement created successfully');
        setNewRental({
          propertyId: '',
          farmerId: '',
          startDate: '',
          endDate: '',
          rentAmount: '',
          farmingPurpose: ''
        });
        fetchFarmRentals();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create rental');
      }
    } catch (error) {
      console.error('Error creating rental:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const updateRentalStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/landlord/farm-rentals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success('Rental status updated successfully');
        fetchFarmRentals();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="properties">Agricultural Properties</TabsTrigger>
          <TabsTrigger value="rentals">Farm Rentals</TabsTrigger>
          <TabsTrigger value="create">Create Rental</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Agricultural Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePropertySubmit} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Property Name</label>
                    <Input
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                      placeholder="e.g., North Farm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <Input
                      value={newProperty.address}
                      onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                      placeholder="Property address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Size (acres)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProperty.size}
                      onChange={(e) => setNewProperty({ ...newProperty, size: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Soil Type</label>
                    <Input
                      value={newProperty.soilType}
                      onChange={(e) => setNewProperty({ ...newProperty, soilType: e.target.value })}
                      placeholder="e.g., Clay Loam"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Water Source</label>
                    <Input
                      value={newProperty.waterSource}
                      onChange={(e) => setNewProperty({ ...newProperty, waterSource: e.target.value })}
                      placeholder="e.g., Well, River"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Add Agricultural Property</Button>
              </form>
              
              {agriculturalProperties.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Size (acres)</TableHead>
                      <TableHead>Soil Type</TableHead>
                      <TableHead>Water Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agriculturalProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>{property.name}</TableCell>
                        <TableCell>{property.address}</TableCell>
                        <TableCell>{property.size}</TableCell>
                        <TableCell>{property.soilType}</TableCell>
                        <TableCell>{property.waterSource}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No agricultural properties added yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rentals">
          <Card>
            <CardHeader>
              <CardTitle>Farm Rental Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              {farmRentals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Rent Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {farmRentals.map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell>{rental.farmer.name}</TableCell>
                        <TableCell>{agriculturalProperties.find(p => p.id === rental.id)?.name}</TableCell>
                        <TableCell>{rental.farmingPurpose}</TableCell>
                        <TableCell>
                          {new Date(rental.startDate).toLocaleDateString()} to {new Date(rental.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${rental.rentAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              rental.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              rental.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {rental.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={rental.status}
                            onValueChange={(value) => updateRentalStatus(rental.id, value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="EXPIRED">Expired</SelectItem>
                              <SelectItem value="TERMINATED">Terminated</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No farm rental agreements found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Farm Rental Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRentalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Property</label>
                    <Select
                      value={newRental.propertyId}
                      onValueChange={(value) => setNewRental({ ...newRental, propertyId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                      <SelectContent>
                        {agriculturalProperties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name} ({property.size} acres)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Farmer</label>
                    <Select
                      value={newRental.farmerId}
                      onValueChange={(value) => setNewRental({ ...newRental, farmerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a farmer" />
                      </SelectTrigger>
                      <SelectContent>
                        {farmers.map((farmer) => (
                          <SelectItem key={farmer.id} value={farmer.id}>
                            {farmer.name} ({farmer.farmingType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Farming Purpose</label>
                  <Textarea
                    value={newRental.farmingPurpose}
                    onChange={(e) => setNewRental({ ...newRental, farmingPurpose: e.target.value })}
                    placeholder="Describe the intended farming use"
                    className="resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rent Amount</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newRental.rentAmount}
                      onChange={(e) => setNewRental({ ...newRental, rentAmount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={newRental.startDate}
                      onChange={(e) => setNewRental({ ...newRental, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <Input
                      type="date"
                      value={newRental.endDate}
                      onChange={(e) => setNewRental({ ...newRental, endDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Create Rental Agreement</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
