import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
}

export default function LandlordDashboard() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="space-y-4">
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
          </div>
          
          <button
            type="button"
            onClick={addUnit}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
          >
            Add Unit
          </button>
          
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
          {properties.map((property) => (
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
                    <p className="text-gray-600">Rent: ${unit.rentAmount}</p>
                    {unit.tenant && (
                      <div className="mt-2 text-sm">
                        <p>Tenant: {unit.tenant.name}</p>
                        <p>Email: {unit.tenant.email}</p>
                      </div>
                      // Add this to your existing Dashboard component's render method, inside the unit mapping
                      {unit.tenant && (
                        <div className="mt-4">
                          <InvoiceGenerator unitId={unit.id} tenantId={unit.tenant.id} />
                        </div>
                      )}
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}