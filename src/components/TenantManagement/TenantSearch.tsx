
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Property } from '@/hooks/useProperties';

interface TenantSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterProperty: string;
  setFilterProperty: (propertyId: string) => void;
  properties: Property[];
}

const TenantSearch: React.FC<TenantSearchProps> = ({
  searchTerm,
  setSearchTerm,
  filterProperty,
  setFilterProperty,
  properties
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search tenants by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-ulomu-beige-dark"
        />
      </div>
      <Select value={filterProperty} onValueChange={setFilterProperty}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by property" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Properties</SelectItem>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TenantSearch;
