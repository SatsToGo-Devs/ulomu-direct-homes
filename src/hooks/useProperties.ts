
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Property {
  id: string;
  user_id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  property_type?: string;
  units_count?: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  size?: number;
  created_at: string;
  updated_at: string;
}

export const useProperties = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (propertyData: Partial<Property>, imageFiles: File[]) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Upload images first
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // Create property with images - insert a single object, not an array
      const { data, error } = await supabase
        .from('properties')
        .insert({
          name: propertyData.name || '',
          address: propertyData.address || '',
          city: propertyData.city,
          state: propertyData.state,
          property_type: propertyData.property_type,
          units_count: propertyData.units_count || 1,
          description: propertyData.description,
          amenities: propertyData.amenities || [],
          user_id: user.id,
          images: imageUrls,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchProperties(); // Refresh the list
      toast({
        title: "Success",
        description: "Property added successfully!",
      });

      return data;
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: "Failed to add property",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    properties,
    loading,
    fetchProperties,
    addProperty,
  };
};
