import React, { useRef } from 'react';
import { Package } from 'lucide-react';
import { ProductBlock } from '@/types/emailBlocks';
import { ProductBlockBubbleMenu } from '../block-toolbars/ProductBlockBubbleMenu';

interface ProductBlockRendererProps {
  block: ProductBlock;
  isSelected: boolean;
  onUpdate: (block: ProductBlock) => void;
}

// Convert Lucide Package icon to data URI
const createPackageIconDataUri = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m7.5 4.27 9 5.15"/>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const ProductBlockRenderer: React.FC<ProductBlockRendererProps> = ({ 
  block, 
  isSelected,
  onUpdate
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const styling = block.styling.desktop;
  const packageIconDataUri = createPackageIconDataUri();

  // Debug logging
  React.useEffect(() => {
    if (isSelected) {
      console.log('ProductBlockRenderer: Block selected', {
        blockRef: !!blockRef.current,
        blockRect: blockRef.current?.getBoundingClientRect(),
        blockElement: blockRef.current
      });
    }
  }, [isSelected]);

  const getImageSrc = (imageSrc: string) => {
    return imageSrc === 'lucide:package' ? packageIconDataUri : imageSrc;
  };

  const getImageAlt = (imageSrc: string, title: string) => {
    return imageSrc === 'lucide:package' ? 'default' : title;
  };

  return (
    <div className="relative">
      {/* Bubble Menu */}
      {isSelected && (
        <ProductBlockBubbleMenu 
          block={block} 
          onUpdate={onUpdate} 
          triggerElement={blockRef.current}
        />
      )}

      <div
        ref={blockRef}
        className={`product-block-renderer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          backgroundColor: styling.backgroundColor,
          padding: styling.padding,
          margin: styling.margin,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {block.content.products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square">
                <img
                  src={getImageSrc(product.image)}
                  alt={getImageAlt(product.image, product.title)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {product.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
