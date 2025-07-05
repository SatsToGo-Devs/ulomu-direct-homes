
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Home } from 'lucide-react';

interface PropertyOccupancyProps {
  totalUnits: number;
  occupiedUnits: number;
  propertyName: string;
}

const PropertyOccupancy = ({ totalUnits, occupiedUnits, propertyName }: PropertyOccupancyProps) => {
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Home className="h-4 w-4 text-terracotta" />
          Occupancy Status
        </h4>
        <Badge variant="outline" className="text-sm">
          {occupancyRate.toFixed(0)}% occupied
        </Badge>
      </div>
      
      <Progress value={occupancyRate} className="mb-3" />
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-600">
            <Users className="h-3 w-3" />
            <span className="font-medium">{totalUnits}</span>
          </div>
          <p className="text-xs text-gray-500">Total Units</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-green-600">
            <Users className="h-3 w-3" />
            <span className="font-medium">{occupiedUnits}</span>
          </div>
          <p className="text-xs text-gray-500">Occupied</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400">
            <Home className="h-3 w-3" />
            <span className="font-medium">{vacantUnits}</span>
          </div>
          <p className="text-xs text-gray-500">Available</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyOccupancy;
