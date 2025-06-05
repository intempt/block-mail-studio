
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Package, FileText, Users } from 'lucide-react';
import { dummyProductData } from '@/data/dummyProductData';

interface ContentProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProviderSelect: (provider: string, data?: any) => void;
}

export const ContentProviderDialog: React.FC<ContentProviderDialogProps> = ({
  isOpen,
  onClose,
  onProviderSelect
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const providers = [
    {
      id: 'products',
      name: 'Products',
      description: 'E-commerce product catalog with images, prices, and descriptions',
      icon: <Package className="w-6 h-6" />,
      dataCount: dummyProductData.length,
      preview: dummyProductData.slice(0, 3)
    },
    {
      id: 'customers',
      name: 'Customers',
      description: 'Customer database with contact information and preferences',
      icon: <Users className="w-6 h-6" />,
      dataCount: 0,
      preview: []
    },
    {
      id: 'articles',
      name: 'Articles',
      description: 'Blog posts and articles with metadata',
      icon: <FileText className="w-6 h-6" />,
      dataCount: 0,
      preview: []
    },
    {
      id: 'custom',
      name: 'Custom JSON',
      description: 'Import your own JSON data array',
      icon: <Database className="w-6 h-6" />,
      dataCount: 0,
      preview: []
    }
  ];

  const handleProviderSelect = (providerId: string) => {
    if (providerId === 'products') {
      // Auto-configure the content block with product data
      const productData = {
        jsonData: dummyProductData,
        selectedFields: ['title', 'price', 'description', 'image_link'],
        fieldMappings: {
          title: { label: 'Product Name', type: 'text' },
          price: { label: 'Price', type: 'currency' },
          description: { label: 'Description', type: 'text' },
          image_link: { label: 'Image', type: 'image' }
        }
      };
      onProviderSelect(providerId, productData);
    } else {
      onProviderSelect(providerId);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Content Provider</DialogTitle>
          <DialogDescription>
            Choose a data source for your content block. This will populate the block with structured data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {providers.map((provider) => (
            <Card 
              key={provider.id} 
              className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                selectedProvider === provider.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedProvider(provider.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {provider.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {provider.dataCount} items
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
                
                {provider.preview.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preview:</p>
                    {provider.preview.map((item, index) => (
                      <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-gray-500 truncate">{item.price}</div>
                      </div>
                    ))}
                  </div>
                )}

                {provider.dataCount === 0 && (
                  <div className="text-xs text-gray-400 italic">
                    Coming soon...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => selectedProvider && handleProviderSelect(selectedProvider)}
            disabled={!selectedProvider}
          >
            Use {selectedProvider ? providers.find(p => p.id === selectedProvider)?.name : 'Provider'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
