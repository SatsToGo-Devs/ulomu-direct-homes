
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PropertyTabsProps {
  description: string;
  amenities: string[];
}

const PropertyTabs = ({ description, amenities }: PropertyTabsProps) => {
  return (
    <Tabs defaultValue="description" className="mb-8">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="amenities">Amenities</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="bg-white p-4 rounded-md">
        <h3 className="font-semibold text-lg mb-3">About this property</h3>
        <p className="text-gray-700">{description}</p>
      </TabsContent>
      <TabsContent value="amenities" className="bg-white p-4 rounded-md">
        <h3 className="font-semibold text-lg mb-3">Amenities</h3>
        <div className="grid grid-cols-2 gap-2">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center">
              <div className="h-2 w-2 bg-terracotta rounded-full mr-2"></div>
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="location" className="bg-white p-4 rounded-md">
        <h3 className="font-semibold text-lg mb-3">Location</h3>
        <div className="bg-gray-200 h-64 flex items-center justify-center rounded-md">
          <p className="text-gray-500">Map will be displayed here</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PropertyTabs;
