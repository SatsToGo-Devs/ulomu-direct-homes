
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/hooks/useProperties';
import { Building, Users, DollarSign, TrendingUp, MapPin, Calendar } from 'lucide-react';

interface OverviewProps {
  properties: Property[];
  payments: {
    id: string;
    amount: string;
  }[];
}

const Overview = ({ properties, payments }: OverviewProps) => {
  // Calculate metrics
  const totalUnits = properties.reduce((sum, property) => sum + (property.units_count || 1), 0);
  const occupiedUnits = 0; // This would need to be calculated from actual tenant data
  const totalRevenue = payments.reduce((acc, payment) => {
    const amount = parseInt(payment.amount.replace('₦', '').replace(/,/g, ''));
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Group properties by type
  const propertyTypes = properties.reduce((acc, property) => {
    const type = property.property_type || 'RESIDENTIAL';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-forest/10 to-forest/20 border-forest/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-forest flex items-center gap-2">
              <Building className="h-4 w-4" />
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-forest">{properties.length}</p>
            <p className="text-xs text-forest/70 mt-1">Active portfolio</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-ulomu-gold/10 to-ulomu-gold/20 border-ulomu-gold/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-ulomu-gold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-ulomu-gold">{totalUnits}</p>
            <p className="text-xs text-ulomu-gold/70 mt-1">{occupiedUnits} occupied</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-terracotta/10 to-terracotta/20 border-terracotta/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-terracotta flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-terracotta">₦{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-terracotta/70 mt-1">{payments.length} payments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-forest/10 to-forest/20 border-forest/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-forest flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-forest">
              {totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0}%
            </p>
            <p className="text-xs text-forest/70 mt-1">Current rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Property Types Breakdown */}
      {Object.keys(propertyTypes).length > 0 && (
        <Card className="bg-white border-ulomu-beige-dark">
          <CardHeader>
            <CardTitle className="text-forest">Property Portfolio Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(propertyTypes).map(([type, count]) => (
                <div key={type} className="p-4 bg-ulomu-beige rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {type.replace('_', ' ').toLowerCase().replace(/^./, c => c.toUpperCase())}
                      </p>
                      <p className="text-2xl font-bold text-forest">{count}</p>
                    </div>
                    <Badge variant="outline" className="bg-forest/10 text-forest border-forest/30">
                      {Math.round((count / properties.length) * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Properties */}
      {properties.length > 0 && (
        <Card className="bg-white border-ulomu-beige-dark">
          <CardHeader>
            <CardTitle className="text-forest">Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {properties.slice(0, 5).map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-3 bg-ulomu-beige rounded-lg">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.name}
                      className="w-12 h-12 rounded-lg object-cover border border-ulomu-beige-dark"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-forest/10 border border-forest/20 flex items-center justify-center">
                      <Building className="h-6 w-6 text-forest" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{property.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {property.units_count || 1} units
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(property.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-forest/10 text-forest border-forest/30"
                  >
                    {property.property_type || 'Residential'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Overview;
