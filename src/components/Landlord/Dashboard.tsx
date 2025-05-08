import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InvoiceGenerator from '../Invoice/InvoiceGenerator';

interface Unit {
  id: string;
  unitNumber: string;
  rentAmount: string;
  status: string;
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
  tenantEmail?: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  units: Unit[];
}

export default function LandlordDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    units: [{ unitNumber: '', rentAmount: '' }],
  });

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addUnit = () => {
    setNewProperty({
      ...newProperty,
      units: [...newProperty.units, { unitNumber: '', rentAmount: '' }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty),
      });
      if (response.ok) {
        setNewProperty({ name: '', address: '', units: [{ unitNumber: '', rentAmount: '' }] });
        fetchProperties();
      }
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#F5F0E6]">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#C45B39]">Add New Property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={newProperty.name}
            onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
            placeholder="Property Name"
            className="w-full p-2 border border-[#D4A64A] rounded-lg focus:ring-2 focus:ring-[#C45B39] focus:border-transparent"
          />
          <input
            type="text"
            value={newProperty.address}
            onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
            placeholder="Property Address"
            className="w-full p-2 border border-[#D4A64A] rounded-lg focus:ring-2 focus:ring-[#C45B39] focus:border-transparent"
          />
          <div className="space-y-4">
            {newProperty.units.map((unit, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={unit.unitNumber}
                  onChange={(e) => {
                    const newUnits = [...newProperty.units];
                    newUnits[index].unitNumber = e.target.value;
                    setNewProperty({ ...newProperty, units: newUnits });
                  }}
                  placeholder="Unit Number"
                  className="flex-1 p-2 border border-[#D4A64A] rounded-lg focus:ring-2 focus:ring-[#C45B39] focus:border-transparent"
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
                  className="flex-1 p-2 border border-[#D4A64A] rounded-lg focus:ring-2 focus:ring-[#C45B39] focus:border-transparent"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addUnit}
            className="w-full bg-[#2C5530] text-[#F5F0E6] py-2 rounded hover:bg-[#D4A64A] transition-colors duration-200"
          >
            Add Unit
          </button>
          <button
            type="submit"
            className="w-full bg-[#C45B39] text-[#F5F0E6] py-2 rounded hover:bg-[#2C5530] transition-colors duration-200"
          >
            Add Property
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#C45B39]">Your Properties</h2>
        <div className="space-y-6">
          {properties.map((property) => (
            <div key={property.id} className="border border-[#D4A64A] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#2C5530]">{property.name}</h3>
              <p className="text-gray-700 mb-4">{property.address}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.units.map((unit) => (
                  <div key={unit.id} className="border border-[#D4A64A] rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Unit {unit.unitNumber}</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        unit.status === 'OCCUPIED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {unit.status}
                      </span>
                    </div>
                    <p className="text-gray-600">Rent: ${unit.rentAmount}</p>

                    {unit.tenant ? (
                      <>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Tenant: {unit.tenant.name}</p>
                          <p>Email: {unit.tenant.email}</p>
                        </div>
                        <div className="mt-2">
                          <Link
                            to={`/messages/${unit.tenant.id}`}
                            className="text-[#C45B39] hover:text-[#2C5530]"
                          >
                            Message Tenant
                          </Link>
                        </div>
                        <div className="mt-4">
                          <InvoiceGenerator unitId={unit.id} tenantId={unit.tenant.id} />
                        </div>
                      </>
                    ) : (
                      <div className="mt-4">
                        <input
                          type="email"
                          placeholder="Tenant Email"
                          className="w-full p-2 border border-[#D4A64A] rounded-lg mb-2"
                          onChange={(e) => {
                            const newUnits = [...properties];
                            const currentUnit = newUnits.find(p => p.units.find(u => u.id === unit.id));
                            if (currentUnit) {
                              currentUnit.tenantEmail = e.target.value;
                            }
                            setProperties(newUnits);
                          }}
                        />
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/landlord/assign-unit', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  unitId: unit.id,
                                  tenantEmail: unit.tenantEmail,
                                }),
                              });
                              if (response.ok) {
                                fetchProperties();
                              }
                            } catch (error) {
                              console.error('Failed to assign unit:', error);
                            }
                          }}
                          className="w-full bg-[#C45B39] text-[#F5F0E6] py-2 rounded hover:bg-[#2C5530] transition-colors duration-200"
                        >
                          Assign Tenant
                        </button>
                      </div>
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