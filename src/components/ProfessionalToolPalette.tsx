
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Type, Image, Layout, Zap } from 'lucide-react';

interface ProfessionalToolPaletteProps {
  editor: any;
}

export const ProfessionalToolPalette: React.FC<ProfessionalToolPaletteProps> = ({ editor }) => {
  const tools = [
    { name: 'Typography', icon: Type, description: 'Font styles and sizes' },
    { name: 'Colors', icon: Palette, description: 'Brand colors and themes' },
    { name: 'Images', icon: Image, description: 'Image management' },
    { name: 'Layout', icon: Layout, description: 'Spacing and alignment' },
    { name: 'Effects', icon: Zap, description: 'Shadows and borders' }
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm mb-3">Design Tools</h3>
      <div className="space-y-2">
        {tools.map((tool) => (
          <Card key={tool.name} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-start gap-3">
              <tool.icon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">{tool.name}</h4>
                <p className="text-xs text-gray-600">{tool.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
