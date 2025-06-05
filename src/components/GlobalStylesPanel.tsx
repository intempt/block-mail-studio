
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  MousePointer, 
  Link, 
  Mail,
  RefreshCw,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { GlobalStylesService } from '@/services/globalStylesService';
import { GlobalStyleDefinition, ChangeImpact } from '@/types/universal';

interface GlobalStylesPanelProps {
  onStylesChange?: (styles: any) => void;
  compactMode?: boolean;
}

export const GlobalStylesPanel: React.FC<GlobalStylesPanelProps> = ({
  onStylesChange,
  compactMode = false
}) => {
  const [styles, setStyles] = useState<GlobalStyleDefinition[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [impactAnalysis, setImpactAnalysis] = useState<ChangeImpact[]>([]);
  const [showUniversalWarning, setShowUniversalWarning] = useState(false);

  useEffect(() => {
    const allStyles = GlobalStylesService.getAllStyles();
    setStyles(allStyles);
  }, []);

  const handleStyleChange = (styleId: string, newValue: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [styleId]: newValue
    }));

    // Show warning about universal impact
    setShowUniversalWarning(true);
  };

  const applyUniversalChanges = () => {
    const impacts: ChangeImpact[] = [];
    
    Object.entries(pendingChanges).forEach(([styleId, newValue]) => {
      const styleImpacts = GlobalStylesService.updateStyleUniversally(styleId, newValue);
      impacts.push(...styleImpacts);
    });

    setImpactAnalysis(impacts);
    setPendingChanges({});
    setShowUniversalWarning(false);
    
    // Refresh styles
    const updatedStyles = GlobalStylesService.getAllStyles();
    setStyles(updatedStyles);
    
    onStylesChange?.(updatedStyles);
  };

  const discardChanges = () => {
    setPendingChanges({});
    setShowUniversalWarning(false);
  };

  const getStyleValue = (style: GlobalStyleDefinition) => {
    return pendingChanges[style.id] || style.value;
  };

  const getTabIcon = (scope: string) => {
    switch (scope) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'headings': return <Type className="w-4 h-4" />;
      case 'buttons': return <MousePointer className="w-4 h-4" />;
      case 'links': return <Link className="w-4 h-4" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  const renderStyleControl = (style: GlobalStyleDefinition) => {
    const currentValue = getStyleValue(style);
    const hasChanges = pendingChanges[style.id] !== undefined;

    return (
      <div key={style.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={style.id} className="text-sm font-medium">
            {style.property}
            {hasChanges && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Changed
              </Badge>
            )}
          </Label>
          <Globe className="w-3 h-3 text-blue-500" title="Universal style" />
        </div>
        
        {style.property === 'color' || style.property === 'backgroundColor' ? (
          <div className="flex gap-2">
            <Input
              id={style.id}
              type="color"
              value={currentValue}
              onChange={(e) => handleStyleChange(style.id, e.target.value)}
              className="w-16 h-8 p-1 border rounded"
            />
            <Input
              type="text"
              value={currentValue}
              onChange={(e) => handleStyleChange(style.id, e.target.value)}
              className="flex-1"
              placeholder="#000000"
            />
          </div>
        ) : style.property === 'fontFamily' ? (
          <select
            value={currentValue}
            onChange={(e) => handleStyleChange(style.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
          </select>
        ) : (
          <Input
            id={style.id}
            type="text"
            value={currentValue}
            onChange={(e) => handleStyleChange(style.id, e.target.value)}
            className="w-full"
          />
        )}
      </div>
    );
  };

  const scopes = ['email', 'text', 'headings', 'buttons', 'links'];

  if (compactMode) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Global Styles
        </h3>
        
        <div className="space-y-3">
          {styles.slice(0, 3).map(renderStyleControl)}
        </div>

        {showUniversalWarning && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Universal Changes Pending
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Changes will affect all templates using these styles
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={applyUniversalChanges}
                    className="text-xs"
                  >
                    Apply to All
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={discardChanges}
                    className="text-xs"
                  >
                    Discard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Global Styles
        </h3>
        <Badge variant="outline" className="text-xs">
          Universal
        </Badge>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid grid-cols-5 w-full mb-4">
          {scopes.map((scope) => (
            <TabsTrigger 
              key={scope} 
              value={scope} 
              className="flex items-center gap-1 text-xs"
            >
              {getTabIcon(scope)}
              <span className="hidden sm:inline">
                {scope.charAt(0).toUpperCase() + scope.slice(1)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {scopes.map((scope) => (
          <TabsContent key={scope} value={scope} className="space-y-4">
            {styles
              .filter(style => style.scope === scope)
              .map(renderStyleControl)
            }
          </TabsContent>
        ))}
      </Tabs>

      {showUniversalWarning && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-800 mb-1">
                Universal Style Changes
              </p>
              <p className="text-sm text-blue-700 mb-3">
                These changes will be applied to all templates and emails using these global styles.
                {Object.keys(pendingChanges).length} style{Object.keys(pendingChanges).length > 1 ? 's' : ''} will be updated.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={applyUniversalChanges}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Apply Universal Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={discardChanges}
                >
                  Discard Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {impactAnalysis.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-1">
            Changes Applied Successfully
          </p>
          <p className="text-xs text-green-700">
            {impactAnalysis.length} templates were updated with your global style changes.
          </p>
        </div>
      )}
    </Card>
  );
};
