
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Eye,
  Send,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Download
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmailTemplate } from './TemplateManager';

interface EnhancedTopBarProps {
  onBack?: () => void;
  canvasWidth: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile' | 'custom';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => void;
  onWidthChange: (width: number) => void;
  onPreview: () => void;
  onSaveTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
  onPublish: () => void;
  emailHTML: string;
  subjectLine: string;
}

export const EnhancedTopBar: React.FC<EnhancedTopBarProps> = ({
  onBack,
  canvasWidth,
  deviceMode,
  onDeviceChange,
  onWidthChange,
  onPreview,
  onSaveTemplate,
  onPublish,
  emailHTML,
  subjectLine
}) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleWidthSliderChange = (value: number[]) => {
    onWidthChange(value[0]);
  };

  const handleSaveTemplate = () => {
    const template = {
      name: templateName || subjectLine || 'Untitled Template',
      description: templateDescription || `Template created on ${new Date().toLocaleDateString()}`,
      html: emailHTML,
      subject: subjectLine,
      category: 'Custom',
      tags: ['user-created'],
      isFavorite: false
    };
    
    onSaveTemplate(template);
    setSaveDialogOpen(false);
    setTemplateName('');
    setTemplateDescription('');
  };

  const handleExportTemplate = () => {
    const template = {
      name: templateName || subjectLine || 'Untitled Template',
      html: emailHTML,
      subject: subjectLine,
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deviceConfig = {
    desktop: { icon: Monitor, width: 1200, label: 'Desktop' },
    tablet: { icon: Tablet, width: 768, label: 'Tablet' },
    mobile: { icon: Smartphone, width: 375, label: 'Mobile' }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <h1 className="text-xl font-semibold text-gray-900">Email Builder</h1>
      </div>
      
      {/* Center Section - Responsive Controls */}
      <div className="flex items-center gap-6">
        {/* Device Toggle Buttons */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {Object.entries(deviceConfig).map(([device, config]) => {
            const IconComponent = config.icon;
            const isActive = deviceMode === device;
            
            return (
              <Button
                key={device}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onDeviceChange(device as 'desktop' | 'tablet' | 'mobile')}
                className={`flex items-center gap-2 h-8 px-3 ${
                  isActive ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title={`${config.label} (${config.width}px)`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-xs font-medium">{config.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Width Slider */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-sm text-gray-600 whitespace-nowrap">Width:</span>
          <Slider
            value={[canvasWidth]}
            onValueChange={handleWidthSliderChange}
            max={1920}
            min={320}
            step={10}
            className="flex-1"
          />
          <Badge variant="outline" className="text-xs font-mono min-w-[60px] text-center">
            {canvasWidth}px
          </Badge>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Button onClick={onPreview} variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Save Email Template</DialogTitle>
              <DialogDescription>
                Save this email as a reusable template with liquid tag support.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder={subjectLine || 'Enter template name'}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Template description (optional)"
                  className="col-span-3"
                />
              </div>
              
              {/* Liquid Tags Preview */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Liquid Tags Support</h4>
                <p className="text-xs text-blue-700">
                  This template will support dynamic content with liquid tags like 
                  <code className="bg-blue-100 px-1 rounded text-blue-800">{'{{first_name}}'}</code>, 
                  <code className="bg-blue-100 px-1 rounded text-blue-800 ml-1">{'{{company}}'}</code>, 
                  and custom variables.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleExportTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button onClick={onPublish} className="bg-blue-600 hover:bg-blue-700" size="sm">
          <Send className="w-4 h-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
};

export default EnhancedTopBar;
