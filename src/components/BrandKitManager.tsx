
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Type, 
  Image, 
  Save, 
  Plus, 
  Trash2,
  Copy,
  Upload
} from 'lucide-react';

export interface BrandKit {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  logo?: string;
  createdAt: Date;
}

interface BrandKitManagerProps {
  currentBrandKit?: BrandKit;
  onBrandKitChange: (brandKit: BrandKit) => void;
}

export const BrandKitManager: React.FC<BrandKitManagerProps> = ({
  currentBrandKit,
  onBrandKitChange
}) => {
  const [brandKits, setBrandKits] = useState<BrandKit[]>([
    {
      id: 'default',
      name: 'Default Brand',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        background: '#F8FAFC',
        text: '#1F2937'
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        accent: 'Inter, sans-serif'
      },
      createdAt: new Date()
    }
  ]);

  const [newBrandKit, setNewBrandKit] = useState<Partial<BrandKit>>({
    name: '',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#F8FAFC',
      text: '#1F2937'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      accent: 'Inter, sans-serif'
    }
  });

  const [isCreating, setIsCreating] = useState(false);

  const fontOptions = [
    'Inter, sans-serif',
    'Helvetica, Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Roboto, sans-serif',
    'Montserrat, sans-serif',
    'Poppins, sans-serif',
    'Open Sans, sans-serif'
  ];

  const handleSaveBrandKit = () => {
    if (!newBrandKit.name || !newBrandKit.colors || !newBrandKit.fonts) return;

    const brandKit: BrandKit = {
      id: Date.now().toString(),
      name: newBrandKit.name,
      colors: newBrandKit.colors,
      fonts: newBrandKit.fonts,
      logo: newBrandKit.logo,
      createdAt: new Date()
    };

    setBrandKits([...brandKits, brandKit]);
    setIsCreating(false);
    setNewBrandKit({
      name: '',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        background: '#F8FAFC',
        text: '#1F2937'
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        accent: 'Inter, sans-serif'
      }
    });
  };

  const handleApplyBrandKit = (brandKit: BrandKit) => {
    onBrandKitChange(brandKit);
  };

  const handleDeleteBrandKit = (id: string) => {
    setBrandKits(brandKits.filter(kit => kit.id !== id));
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Brand Kit</h3>
          </div>
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Kit
          </Button>
        </div>

        {currentBrandKit && (
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700">Current Brand Kit</Label>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-900">{currentBrandKit.name}</span>
                <div className="flex gap-1">
                  {Object.values(currentBrandKit.colors).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {isCreating && (
            <Card className="p-4 mb-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Create New Brand Kit</h4>
              
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="fonts">Fonts</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="colors" className="space-y-4">
                  <div>
                    <Label htmlFor="kit-name">Brand Kit Name</Label>
                    <Input
                      id="kit-name"
                      value={newBrandKit.name}
                      onChange={(e) => setNewBrandKit({ ...newBrandKit, name: e.target.value })}
                      placeholder="My Brand Kit"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(newBrandKit.colors || {}).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-xs font-medium text-gray-600 capitalize">
                          {key}
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => setNewBrandKit({
                              ...newBrandKit,
                              colors: { ...newBrandKit.colors!, [key]: e.target.value }
                            })}
                            className="w-8 h-8 border border-gray-300 rounded"
                          />
                          <Input
                            value={value}
                            onChange={(e) => setNewBrandKit({
                              ...newBrandKit,
                              colors: { ...newBrandKit.colors!, [key]: e.target.value }
                            })}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="fonts" className="space-y-4">
                  {Object.entries(newBrandKit.fonts || {}).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-sm font-medium text-gray-700 capitalize">
                        {key} Font
                      </Label>
                      <select
                        value={value}
                        onChange={(e) => setNewBrandKit({
                          ...newBrandKit,
                          fonts: { ...newBrandKit.fonts!, [key]: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        {fontOptions.map((font) => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="assets" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Logo</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Upload your logo</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsCreating(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveBrandKit} disabled={!newBrandKit.name} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Kit
                </Button>
              </div>
            </Card>
          )}

          <div className="space-y-3">
            {brandKits.map((kit) => (
              <Card key={kit.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{kit.name}</h4>
                    <p className="text-xs text-gray-500">
                      Created {kit.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(kit))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    {kit.id !== 'default' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBrandKit(kit.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex gap-1 mb-2">
                      {Object.values(kit.colors).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={Object.keys(kit.colors)[index]}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">
                      Fonts: {kit.fonts.heading.split(',')[0]}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyBrandKit(kit)}
                    className="w-full"
                  >
                    Apply Brand Kit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
