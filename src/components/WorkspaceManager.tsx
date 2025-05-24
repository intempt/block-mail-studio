
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Layout, 
  Monitor, 
  Moon, 
  Sun, 
  Grid, 
  Sidebar,
  Maximize2,
  Minimize2,
  Settings,
  Save,
  RotateCcw,
  Palette,
  Keyboard
} from 'lucide-react';

interface WorkspaceSettings {
  theme: 'light' | 'dark' | 'auto';
  sidebarPosition: 'left' | 'right';
  panelLayout: 'default' | 'minimal' | 'expanded';
  showToolbar: boolean;
  showStatusBar: boolean;
  autoSave: boolean;
  keyboardShortcuts: boolean;
  compactMode: boolean;
}

interface WorkspaceManagerProps {
  onSettingsChange: (settings: WorkspaceSettings) => void;
}

export const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ 
  onSettingsChange 
}) => {
  const [settings, setSettings] = useState<WorkspaceSettings>({
    theme: 'light',
    sidebarPosition: 'left',
    panelLayout: 'default',
    showToolbar: true,
    showStatusBar: true,
    autoSave: true,
    keyboardShortcuts: true,
    compactMode: false
  });

  const [activeTab, setActiveTab] = useState<'layout' | 'appearance' | 'behavior'>('layout');

  const updateSetting = <K extends keyof WorkspaceSettings>(
    key: K, 
    value: WorkspaceSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const resetToDefaults = () => {
    const defaultSettings: WorkspaceSettings = {
      theme: 'light',
      sidebarPosition: 'left',
      panelLayout: 'default',
      showToolbar: true,
      showStatusBar: true,
      autoSave: true,
      keyboardShortcuts: true,
      compactMode: false
    };
    setSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  const layouts = [
    { id: 'default', name: 'Default', description: 'Balanced layout for most users' },
    { id: 'minimal', name: 'Minimal', description: 'Clean interface with fewer distractions' },
    { id: 'expanded', name: 'Expanded', description: 'Maximum workspace for complex projects' }
  ];

  const keyboardShortcuts = [
    { key: 'Ctrl + S', action: 'Save email' },
    { key: 'Ctrl + Z', action: 'Undo' },
    { key: 'Ctrl + Y', action: 'Redo' },
    { key: 'Ctrl + B', action: 'Bold text' },
    { key: 'Ctrl + I', action: 'Italic text' },
    { key: 'Ctrl + K', action: 'Insert link' },
    { key: 'Ctrl + Shift + P', action: 'Open command palette' },
    { key: 'F11', action: 'Toggle fullscreen' }
  ];

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Layout className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Workspace Manager</h3>
          <Badge variant="secondary" className="ml-auto">
            Customizable
          </Badge>
        </div>

        <div className="flex gap-1">
          {[
            { id: 'layout', label: 'Layout', icon: <Grid className="w-4 h-4" /> },
            { id: 'appearance', label: 'Theme', icon: <Palette className="w-4 h-4" /> },
            { id: 'behavior', label: 'Behavior', icon: <Settings className="w-4 h-4" /> }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-4 h-full overflow-y-auto">
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Panel Layout</Label>
                <div className="space-y-2">
                  {layouts.map((layout) => (
                    <Card 
                      key={layout.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        settings.panelLayout === layout.id 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => updateSetting('panelLayout', layout.id as any)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{layout.name}</div>
                          <div className="text-xs text-gray-600">{layout.description}</div>
                        </div>
                        {settings.panelLayout === layout.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Sidebar Position</Label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.sidebarPosition === 'left' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('sidebarPosition', 'left')}
                    className="flex-1"
                  >
                    <Sidebar className="w-4 h-4 mr-2" />
                    Left
                  </Button>
                  <Button
                    variant={settings.sidebarPosition === 'right' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('sidebarPosition', 'right')}
                    className="flex-1"
                  >
                    <Sidebar className="w-4 h-4 mr-2 scale-x-[-1]" />
                    Right
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Toolbar</Label>
                  <Switch
                    checked={settings.showToolbar}
                    onCheckedChange={(checked) => updateSetting('showToolbar', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Status Bar</Label>
                  <Switch
                    checked={settings.showStatusBar}
                    onCheckedChange={(checked) => updateSetting('showStatusBar', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Compact Mode</Label>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('theme', 'light')}
                    className="flex flex-col items-center gap-2 h-auto p-3"
                  >
                    <Sun className="w-4 h-4" />
                    <span className="text-xs">Light</span>
                  </Button>
                  
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('theme', 'dark')}
                    className="flex flex-col items-center gap-2 h-auto p-3"
                  >
                    <Moon className="w-4 h-4" />
                    <span className="text-xs">Dark</span>
                  </Button>
                  
                  <Button
                    variant={settings.theme === 'auto' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('theme', 'auto')}
                    className="flex flex-col items-center gap-2 h-auto p-3"
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs">Auto</span>
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Preview</Label>
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Layout className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Workspace Preview</div>
                      <div className="text-xs text-gray-600">
                        {settings.theme === 'light' ? 'Light theme' : 
                         settings.theme === 'dark' ? 'Dark theme' : 'Auto theme'} • 
                        {settings.panelLayout} layout
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Auto-save</Label>
                    <p className="text-xs text-gray-600">Automatically save changes</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Keyboard Shortcuts</Label>
                    <p className="text-xs text-gray-600">Enable power user shortcuts</p>
                  </div>
                  <Switch
                    checked={settings.keyboardShortcuts}
                    onCheckedChange={(checked) => updateSetting('keyboardShortcuts', checked)}
                  />
                </div>
              </div>

              {settings.keyboardShortcuts && (
                <div>
                  <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Keyboard Shortcuts
                  </Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {keyboardShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{shortcut.action}</span>
                        <Badge variant="outline" className="text-xs font-mono">
                          {shortcut.key}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefaults} className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </div>
    </Card>
  );
};
