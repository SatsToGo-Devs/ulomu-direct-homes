
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceChargeManager from './ServiceChargeManager';
import MaintenanceManager from './MaintenanceManager';
import AgricultureRentals from './AgricultureRentals';
import InvoiceGenerator from '../Invoice/InvoiceGenerator';

interface Unit {
  id: string;
  unitNumber: string;
  rentAmount: number;
  status: string;
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
  leaseStart?: string;
  leaseEnd?: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  units: Unit[];
  propertyType: string;
}

export default function LandlordDashboard() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    propertyType: 'RESIDENTIAL',
    units: [{ unitNumber: '', rentAmount: '', status: 'VACANT' }],
  });

  const fetchProperties = async () => {
    const response = await fetch('/api/landlord/properties');
    const data = await response.json();
    setProperties(data);
  };

  const addUnit = () => {
    setNewProperty({
      ...newProperty,
      units: [...newProperty.units, { unitNumber: '', rentAmount: '', status: 'VACANT' }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/landlord/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty),
      });

      if (response.ok) {
        fetchProperties();
        setNewProperty({
          name: '',
          address: '',
          propertyType: 'RESIDENTIAL',
          units: [{ unitNumber: '', rentAmount: '', status: 'VACANT' }],
        });
      }
    } catch (error) {
      console.error('Failed to create property:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <Tabs defaultValue="properties" className="space-y-6">
      <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-5">
        <TabsTrigger value="properties">Properties</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        <TabsTrigger value="service-charges">Service Charges</TabsTrigger>
        <TabsTrigger value="agriculture">Agricultural Land</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
      </TabsList>
      
      <TabsContent value="properties" className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newProperty.name}
                onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                placeholder="Property Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={newProperty.address}
                onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                placeholder="Address"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Property Type</label>
              <select
                value={newProperty.propertyType}
                onChange={(e) => setNewProperty({ ...newProperty, propertyType: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="RESIDENTIAL">Residential</option>
                <option value="AGRICULTURAL">Agricultural</option>
              </select>
            </div>
            
            {newProperty.propertyType === 'RESIDENTIAL' && (
              <div className="space-y-4">
                <h3 className="font-medium">Units</h3>
                {newProperty.units.map((unit, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={unit.unitNumber}
                      onChange={(e) => {
                        const newUnits = [...newProperty.units];
                        newUnits[index].unitNumber = e.target.value;
                        setNewProperty({ ...newProperty, units: newUnits });
                      }}
                      placeholder="Unit Number"
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="number"
                      value={unit.rentAmount}
                      onChange={(e) => {
                        const newUnits = [...newProperty.units];
                        newUnits[index].rentAmount = e.target.value;
                        setNewProperty({ ...newProperty, units: newUnits });
                      }}
                      placeholder="Rent Amount"
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addUnit}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
                >
                  Add Unit
                </button>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Property
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
          <div className="space-y-6">
            {properties.filter(p => p.propertyType === 'RESIDENTIAL').map((property) => (
              <div key={property.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold">{property.name}</h3>
                <p className="text-gray-600 mb-4">{property.address}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.units.map((unit) => (
                    <div key={unit.id} className="border rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Unit {unit.unitNumber}</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          unit.status === 'OCCUPIED' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                        }`}>
                          {unit.status}
                        </span>
                      </div>
                      <p className="text-gray-600">Rent: ${Number(unit.rentAmount).toFixed(2)}</p>
                      {unit.tenant && (
                        <div className="mt-2 text-sm">
                          <p>Tenant: {unit.tenant.name}</p>
                          <p>Email: {unit.tenant.email}</p>
                          <div className="mt-4">
                            <InvoiceGenerator 
                              unitId={unit.id} 
                              tenantId={unit.tenant.id} 
                              rentAmount={Number(unit.rentAmount)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="maintenance">
        <MaintenanceManager />
      </TabsContent>
      
      <TabsContent value="service-charges">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Manage Service Charges</h2>
          <p className="text-gray-500">
            Select a unit below to manage its service charges.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {properties
              .filter(p => p.propertyType === 'RESIDENTIAL')
              .flatMap(property => 
                property.units.map(unit => (
                  <button
                    key={unit.id}
                    onClick={() => {
                      const unitServiceCharges = document.getElementById(`unit-charges-${unit.id}`);
                      // Toggle visibility of the service charges component for this unit
                      if (unitServiceCharges) {
                        unitServiceCharges.classList.toggle('hidden');
                      }
                    }}
                    className="p-4 border rounded hover:bg-gray-50 text-left"
                  >
                    <h3 className="font-medium">{property.name} - Unit {unit.unitNumber}</h3>
                    <p className="text-sm text-gray-500">{property.address}</p>
                    <p className="text-sm mt-2">
                      Status: <span className={unit.status === 'OCCUPIED' ? 'text-green-600' : 'text-gray-600'}>
                        {unit.status}
                      </span>
                    </p>
                    <div id={`unit-charges-${unit.id}`} className="hidden mt-4">
                      <ServiceChargeManager unitId={unit.id} />
                    </div>
                  </button>
                ))
              )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="agriculture">
        <AgricultureRentals />
      </TabsContent>
      
      <TabsContent value="invoices">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Invoices</h2>
          <p className="text-gray-500">
            Generate and manage invoices for your properties.
          </p>
          
          {/* We'll implement an invoice list here in the future */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p>Select a unit from the Properties tab to generate invoices.</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
