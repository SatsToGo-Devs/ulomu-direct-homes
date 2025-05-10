
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PropertyImagesProps {
  images: string[];
  title: string;
}

const PropertyImages = ({ images, title }: PropertyImagesProps) => {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`${index === 0 ? 'md:col-span-2 rounded-lg overflow-hidden' : 'rounded-lg overflow-hidden'}`}
            >
              <img 
                src={image} 
                alt={`${title} - Image ${index + 1}`} 
                className="w-full h-full object-cover aspect-[16/10]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyImages;
