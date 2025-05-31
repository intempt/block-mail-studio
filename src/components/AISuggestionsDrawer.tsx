
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle,
  Copy,
  Search,
  Filter,
  Grid,
  List,
  AlertTriangle,
  Target,
  Zap,
  Shield,
  Smartphone,
  FileCheck,
  Eye,
  Layout,
  User,
  Brain,
  Lightbulb,
  MoreVertical,
  X,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import { CriticalSuggestion, CriticalEmailAnalysisService } from '@/services/criticalEmailAnalysisService';

interface AISuggestionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: CriticalSuggestion[];
  onApplySuggestion: (suggestion: CriticalSuggestion) => void;
  onRefresh: () => void;
}

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'critical' | 'high' | 'medium' | 'low' | 'applied' | 'pending';

export const AISuggestionsDrawer: React.FC<AISuggestionsDrawerProps> = ({
  isOpen,
  onClose,
  suggestions,
  onApplySuggestion,
  onRefresh
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  const getTypeIcon = (category: string) => {
    switch (category) {
      case 'subject': return <Target className="w-4 h-4" />;
      case 'deliverability': return <Shield className="w-4 h-4" />;
      case 'cta': return <Zap className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'compliance': return <FileCheck className="w-4 h-4" />;
      case 'accessibility': return <Eye className="w-4 h-4" />;
      case 'structure': return <Layout className="w-4 h-4" />;
      case 'personalization': return <User className="w-4 h-4" />;
      case 'tone': return <Brain className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const filteredSuggestions = useMemo(() => {
    let filtered = suggestions;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status/severity filter
    switch (filterMode) {
      case 'critical':
      case 'high':
      case 'medium':
      case 'low':
        filtered = filtered.filter(s => s.severity === filterMode);
        break;
      case 'applied':
        filtered = filtered.filter(s => s.applied);
        break;
      case 'pending':
        filtered = filtered.filter(s => !s.applied);
        break;
    }

    return filtered;
  }, [suggestions, searchQuery, filterMode]);

  const groupedSuggestions = useMemo(() => {
    const groups = {
      critical: filteredSuggestions.filter(s => s.severity === 'critical'),
      high: filteredSuggestions.filter(s => s.severity === 'high'),
      medium: filteredSuggestions.filter(s => s.severity === 'medium'),
      low: filteredSuggestions.filter(s => s.severity === 'low'),
    };
    return groups;
  }, [filteredSuggestions]);

  const stats = useMemo(() => {
    const total = suggestions.length;
    const applied = suggestions.filter(s => s.applied).length;
    const critical = suggestions.filter(s => s.severity === 'critical' && !s.applied).length;
    const pending = total - applied;
    
    return { total, applied, critical, pending };
  }, [suggestions]);

  const handleSelectSuggestion = (suggestionId: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(suggestionId)) {
      newSelected.delete(suggestionId);
    } else {
      newSelected.add(suggestionId);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleBulkApply = () => {
    selectedSuggestions.forEach(id => {
      const suggestion = suggestions.find(s => s.id === id);
      if (suggestion && !suggestion.applied) {
        onApplySuggestion(suggestion);
      }
    });
    setSelectedSuggestions(new Set());
  };

  const getSeverityColor = (severity: string) => CriticalEmailAnalysisService.getSeverityColor(severity);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[80vh] max-h-[800px]">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={100}>
            <DrawerHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    AI Email Analysis
                  </DrawerTitle>
                  <DrawerDescription>
                    Detailed view of all optimization suggestions for your email
                  </DrawerDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 py-3">
                <Badge variant="outline" className="text-sm">
                  {stats.total} Total
                </Badge>
                <Badge className="bg-green-100 text-green-700">
                  {stats.applied} Applied
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  {stats.pending} Pending
                </Badge>
                {stats.critical > 0 && (
                  <Badge className="bg-red-100 text-red-700">
                    {stats.critical} Critical
                  </Badge>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 py-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search suggestions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      {filterMode === 'all' ? 'All' : filterMode.charAt(0).toUpperCase() + filterMode.slice(1)}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterMode('all')}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterMode('pending')}>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterMode('applied')}>Applied</DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem onClick={() => setFilterMode('critical')}>Critical</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterMode('high')}>High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterMode('medium')}>Medium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterMode('low')}>Low</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none border-l"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {selectedSuggestions.size > 0 && (
                  <Button size="sm" onClick={handleBulkApply}>
                    Apply Selected ({selectedSuggestions.size})
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={onRefresh}>
                  Refresh
                </Button>
              </div>
            </DrawerHeader>

            <ScrollArea className="flex-1 px-6">
              <Tabs defaultValue="grouped" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="grouped">By Severity</TabsTrigger>
                  <TabsTrigger value="category">By Category</TabsTrigger>
                </TabsList>

                <TabsContent value="grouped" className="space-y-6">
                  {Object.entries(groupedSuggestions).map(([severity, suggestions]) => {
                    if (suggestions.length === 0) return null;
                    
                    return (
                      <div key={severity} className="space-y-3">
                        <div className="flex items-center gap-2">
                          {severity === 'critical' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          <h3 className="font-medium text-lg capitalize">{severity} Issues</h3>
                          <Badge variant="outline">{suggestions.length}</Badge>
                        </div>
                        
                        <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                          {suggestions.map((suggestion) => (
                            <SuggestionCard
                              key={suggestion.id}
                              suggestion={suggestion}
                              viewMode={viewMode}
                              isSelected={selectedSuggestions.has(suggestion.id)}
                              onSelect={() => handleSelectSuggestion(suggestion.id)}
                              onApply={() => onApplySuggestion(suggestion)}
                              getTypeIcon={getTypeIcon}
                              getSeverityColor={getSeverityColor}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>

                <TabsContent value="category">
                  <div className="text-center py-8 text-gray-500">
                    Category view coming soon...
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DrawerContent>
    </Drawer>
  );
};

interface SuggestionCardProps {
  suggestion: CriticalSuggestion;
  viewMode: ViewMode;
  isSelected: boolean;
  onSelect: () => void;
  onApply: () => void;
  getTypeIcon: (category: string) => React.ReactNode;
  getSeverityColor: (severity: string) => string;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  viewMode,
  isSelected,
  onSelect,
  onApply,
  getTypeIcon,
  getSeverityColor
}) => {
  return (
    <div className={`border rounded-lg p-4 transition-all ${
      suggestion.applied 
        ? 'bg-green-50 border-green-200 opacity-75' 
        : isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'bg-white hover:shadow-md'
    }`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          disabled={suggestion.applied}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getTypeIcon(suggestion.category)}
              <h4 className="font-medium">{suggestion.title}</h4>
              <Badge variant="outline" className={`text-xs ${getSeverityColor(suggestion.severity)}`}>
                {suggestion.severity}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {suggestion.confidence}%
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(suggestion.suggested)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Fix
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Current:</span>
              <div className="bg-gray-50 p-2 rounded mt-1 font-mono text-xs">
                {suggestion.current}
              </div>
            </div>
            
            <div>
              <span className="font-medium text-blue-700">Suggested:</span>
              <div className="bg-blue-50 p-2 rounded mt-1 font-mono text-xs">
                {suggestion.suggested}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="italic">💡 {suggestion.reason}</p>
            <p className="text-green-600 font-medium mt-1">📈 {suggestion.businessImpact}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline" className="text-xs capitalize">
              {suggestion.category}
            </Badge>
            
            {!suggestion.applied ? (
              <Button size="sm" onClick={onApply} className={
                suggestion.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                suggestion.severity === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
                'bg-purple-600 hover:bg-purple-700'
              }>
                {suggestion.autoFixable ? 'Auto-Fix' : 'Apply'}
              </Button>
            ) : (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Applied</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
