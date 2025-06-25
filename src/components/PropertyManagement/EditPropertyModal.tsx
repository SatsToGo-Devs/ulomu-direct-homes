
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/hooks/useProperties';
import { Edit2 } from 'lucide-react';

interface EditPropertyModalProps {
  property: Property;
  onPropertyUpdated: () => void;
}

const EditPropertyModal = ({ property, onPropertyUpdated }: EditPropertyModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [propertyData, setPropertyData] = useState({
    name: property.name,
    address: property.address,
    city: property.city || '',
    state: property.state || '',
    property_type: property.property_type || 'RESIDENTIAL',
    units_count: property.units_count || 1,
    description: property.description || '',
    size: property.size?.toString() || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updateData = {
        name: propertyData.name,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        property_type: propertyData.property_type,
        units_count: propertyData.units_count,
        description: propertyData.description,
        size: propertyData.size ? parseFloat(propertyData.size) : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', property.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property updated successfully!",
      });
      
      setOpen(false);
      onPropertyUpdated();
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Property Name</Label>
            <Input
              id="name"
              value={propertyData.name}
              onChange={(e) => setPropertyData({...propertyData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={propertyData.address}
              onChange={(e) => setPropertyData({...propertyData, address: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={propertyData.city}
                onChange={(e) => setPropertyData({...propertyData, city: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={propertyData.state}
                onChange={(e) => setPropertyData({...propertyData, state: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_type">Property Type</Label>
              <Select 
                value={propertyData.property_type} 
                onValueChange={(value) => setPropertyData({...propertyData, property_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                  <SelectItem value="MIXED_USE">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="units_count">Number of Units</Label>
              <Input
                id="units_count"
                type="number"
                min="1"
                value={propertyData.units_count}
                onChange={(e) => setPropertyData({...propertyData, units_count: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="size">Size (sq ft)</Label>
            <Input
              id="size"
              type="number"
              value={propertyData.size}
              onChange={(e) => setPropertyData({...propertyData, size: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={propertyData.description}
              onChange={(e) => setPropertyData({...propertyData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyModal;
