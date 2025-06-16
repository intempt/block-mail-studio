
import React from 'react';
import { ProductBlock } from '@/types/emailBlocks';

interface ProductBlockRendererProps {
  block: ProductBlock;
  isSelected: boolean;
  onUpdate: (block: ProductBlock) => void;
}

export const ProductBlockRenderer: React.FC<ProductBlockRendererProps> = ({ 
  block, 
  isSelected 
}) => {
  const styling = block.styling.desktop;

  return (
    <div
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
                src={product.image}
                alt={product.title}
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
  );
};
