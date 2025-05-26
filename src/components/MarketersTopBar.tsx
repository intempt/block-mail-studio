
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Eye,
  Send,
  Monitor,
  Smartphone,
  Save,
  Download,
  ChevronDown,
  Edit3,
  Check,
  Clock,
  FileText,
  Settings
} from 'lucide-react';

interface MarketersTopBarProps {
  campaignTitle: string;
  onCampaignTitleChange: (title: string) => void;
  onBack?: () => void;
  canvasWidth: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile' | 'custom';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile' | 'custom') => void;
  onWidthChange: (width: number) => void;
  onPreview: () => void;
  onSaveTemplate: (template: any) => void;
  onSendTestEmail: (recipients: string[], device: string) => void;
  emailHTML: string;
  subjectLine: string;
  lastSaved?: Date;
  hasUnsavedChanges?: boolean;
}

export const MarketersTopBar: React.FC<MarketersTopBarProps> = ({
  campaignTitle,
  onCampaignTitleChange,
  onBack,
  canvasWidth,
  deviceMode,
  onDeviceChange,
  onWidthChange,
  onPreview,
  onSaveTemplate,
  onSendTestEmail,
  emailHTML,
  subjectLine,
  lastSaved,
  hasUnsavedChanges = false
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(campaignTitle);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [testRecipients, setTestRecipients] = useState('');
  const [testDeviceMode, setTestDeviceMode] = useState('desktop');

  // Email-optimized device presets
  const emailDevicePresets = [
    { name: 'Mobile Email', width: 375, mode: 'mobile' as const },
    { name: 'Desktop Email', width: 600, mode: 'desktop' as const }
  ];

  // Common email width presets
  const emailWidthPresets = [
    { label: '320px', width: 320 },
    { label: '375px', width: 375 },
    { label: '414px', width: 414 },
    { label: '600px', width: 600 },
    { label: '640px', width: 640 }
  ];

  const handleTitleSave = () => {
    onCampaignTitleChange(editedTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditedTitle(campaignTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const handleDevicePresetSelect = (preset: typeof emailDevicePresets[0]) => {
    onDeviceChange(preset.mode);
    onWidthChange(preset.width);
  };

  const handleWidthPresetSelect = (width: number) => {
    onWidthChange(width);
    if (width <= 414) {
      onDeviceChange('mobile');
    } else {
      onDeviceChange('desktop');
    }
  };

  const handleSaveTemplate = () => {
    const template = {
      name: templateName || campaignTitle || 'Untitled Template',
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

  const handleSendTestEmail = () => {
    const recipients = testRecipients.split(',').map(email => email.trim()).filter(Boolean);
    if (recipients.length > 0) {
      onSendTestEmail(recipients, testDeviceMode);
      setTestEmailDialogOpen(false);
      setTestRecipients('');
    }
  };

  const handleExportHTML = () => {
    const blob = new Blob([emailHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaignTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSaveStatus = () => {
    if (hasUnsavedChanges) {
      return { icon: Clock, text: 'Unsaved changes', color: 'text-orange-600' };
    }
    return { icon: Check, text: 'All changes saved', color: 'text-green-600' };
  };

  const saveStatus = getSaveStatus();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Main Top Bar */}
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left Section - Campaign Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleTitleKeyPress}
                  className="text-xl font-semibold border-none p-0 h-auto focus:ring-0 focus:border-none min-w-0 flex-1"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTitleSave}
                  className="text-green-600 hover:text-green-700 flex-shrink-0"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h1 className="text-xl font-semibold text-gray-900 truncate">{campaignTitle}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTitle(true)}
                  className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0 flex-shrink-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
              <saveStatus.icon className={`w-4 h-4 ${saveStatus.color}`} />
              <span className={saveStatus.color}>{saveStatus.text}</span>
              {lastSaved && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Last saved {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center Section - Preview Controls */}
        <div className="flex items-center gap-4 mx-8">
          {/* Device Mode Buttons */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {emailDevicePresets.map((preset) => {
              const isActive = (preset.mode === 'mobile' && canvasWidth <= 414) || 
                              (preset.mode === 'desktop' && canvasWidth > 414);
              
              return (
                <Button
                  key={preset.name}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleDevicePresetSelect(preset)}
                  className={`flex items-center gap-2 h-8 px-3 ${
                    isActive ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  {preset.mode === 'mobile' ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Monitor className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium">{preset.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Width Controls */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {emailWidthPresets.map((preset) => (
                <Button
                  key={preset.width}
                  variant={canvasWidth === preset.width ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleWidthPresetSelect(preset.width)}
                  className="h-7 px-2 text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono min-w-[60px] text-center">
                {canvasWidth}px
              </Badge>
              <Slider
                value={[canvasWidth]}
                onValueChange={(value) => onWidthChange(value[0])}
                min={320}
                max={640}
                step={10}
                className="w-20"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button onClick={onPreview} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSaveDialogOpen(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Save as Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportHTML}>
                <Download className="w-4 h-4 mr-2" />
                Export HTML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={() => setTestEmailDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700" 
            size="sm"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Test Email
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>Subject: <strong>{subjectLine || 'No subject'}</strong></span>
          <Badge variant="secondary" className="text-xs">
            {subjectLine?.length || 0}/50 chars
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Email size: ~{Math.round(emailHTML.length / 1024)}KB</span>
          <Badge 
            variant={canvasWidth <= 414 ? 'default' : 'secondary'} 
            className="text-xs"
          >
            Mobile {canvasWidth <= 414 ? 'Optimized' : 'Compatible'}
          </Badge>
        </div>
      </div>

      {/* Save Template Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save this email as a reusable template for future campaigns.
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
                placeholder={campaignTitle || 'Enter template name'}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="template-description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="template-description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Describe this template's purpose..."
                className="col-span-3 min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Email Dialog */}
      <Dialog open={testEmailDialogOpen} onOpenChange={setTestEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>
              Send a test version of this email to verify how it looks in real email clients.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="test-recipients" className="text-right pt-2">
                Recipients
              </Label>
              <Textarea
                id="test-recipients"
                value={testRecipients}
                onChange={(e) => setTestRecipients(e.target.value)}
                placeholder="Enter email addresses separated by commas"
                className="col-span-3 min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="test-device" className="text-right">
                Optimize for
              </Label>
              <div className="col-span-3 flex gap-2">
                <Button
                  variant={testDeviceMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTestDeviceMode('desktop')}
                  className="flex-1"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={testDeviceMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTestDeviceMode('mobile')}
                  className="flex-1"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendTestEmail} disabled={!testRecipients.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
