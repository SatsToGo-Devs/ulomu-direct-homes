
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Property } from '@/hooks/useProperties';

interface Unit {
  id: string;
  unit_number: string;
  property_id: string;
  status: string;
  rent_amount: number;
}

interface TenantAssignmentFormProps {
  properties: Property[];
  selectedPropertyId: string;
  selectedUnitId: string;
  availableUnits: Unit[];
  rentAmount: string;
  depositAmount: string;
  leaseStartDate: string;
  leaseEndDate: string;
  onPropertySelect: (propertyId: string) => void;
  onUnitSelect: (unitId: string) => void;
  onRentAmountChange: (value: string) => void;
  onDepositAmountChange: (value: string) => void;
  onLeaseStartDateChange: (value: string) => void;
  onLeaseEndDateChange: (value: string) => void;
}

const TenantAssignmentForm: React.FC<TenantAssignmentFormProps> = ({
  properties,
  selectedPropertyId,
  selectedUnitId,
  availableUnits,
  rentAmount,
  depositAmount,
  leaseStartDate,
  leaseEndDate,
  onPropertySelect,
  onUnitSelect,
  onRentAmountChange,
  onDepositAmountChange,
  onLeaseStartDateChange,
  onLeaseEndDateChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="property">Select Property *</Label>
        <Select value={selectedPropertyId} onValueChange={onPropertySelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a property" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPropertyId && (
        <div>
          <Label htmlFor="unit">Select Available Unit *</Label>
          <Select value={selectedUnitId} onValueChange={onUnitSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an available unit" />
            </SelectTrigger>
            <SelectContent>
              {availableUnits.length === 0 ? (
                <SelectItem value="none" disabled>No units available for assignment</SelectItem>
              ) : (
                availableUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    Unit {unit.unit_number} - ₦{unit.rent_amount.toLocaleString()}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {selectedPropertyId && availableUnits.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No units available for assignment. All units in this property have tenants assigned based on your tenant list.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rentAmount">Monthly Rent (₦) *</Label>
          <Input
            id="rentAmount"
            type="number"
            min="0"
            step="0.01"
            value={rentAmount}
            onChange={(e) => onRentAmountChange(e.target.value)}
            placeholder="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="depositAmount">Security Deposit (₦)</Label>
          <Input
            id="depositAmount"
            type="number"
            min="0"
            step="0.01"
            value={depositAmount}
            onChange={(e) => onDepositAmountChange(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="leaseStart">Lease Start Date</Label>
          <Input
            id="leaseStart"
            type="date"
            value={leaseStartDate}
            onChange={(e) => onLeaseStartDateChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="leaseEnd">Lease End Date</Label>
          <Input
            id="leaseEnd"
            type="date"
            value={leaseEndDate}
            onChange={(e) => onLeaseEndDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TenantAssignmentForm;
