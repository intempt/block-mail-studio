
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  Star, 
  Clock, 
  BarChart3, 
  GitBranch,
  Eye,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

interface TemplateVersion {
  id: string;
  version: string;
  createdAt: Date;
  performance: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
    engagement: number;
  };
  changes: string[];
  isActive: boolean;
  mlScore: number;
}

interface TemplateRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  category: 'layout' | 'content' | 'design' | 'cta';
  preview: string;
  estimatedImprovement: number;
}

interface TemplateEvolutionProps {
  editor: Editor | null;
  templateId: string;
}

export const TemplateEvolution: React.FC<TemplateEvolutionProps> = ({ 
  editor, 
  templateId 
}) => {
  const [versions, setVersions] = useState<TemplateVersion[]>([]);
  const [recommendations, setRecommendations] = useState<TemplateRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'versions' | 'recommendations' | 'analytics'>('recommendations');

  useEffect(() => {
    loadTemplateData();
  }, [templateId]);

  const loadTemplateData = async () => {
    // Simulate loading template versions and performance data
    const mockVersions: TemplateVersion[] = [
      {
        id: '1',
        version: 'v3.2',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        performance: {
          openRate: 26.4,
          clickRate: 4.2,
          conversionRate: 2.8,
          engagement: 87
        },
        changes: ['Updated CTA button color', 'Improved mobile layout', 'Added social proof'],
        isActive: true,
        mlScore: 94
      },
      {
        id: '2',
        version: 'v3.1',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        performance: {
          openRate: 24.1,
          clickRate: 3.8,
          conversionRate: 2.3,
          engagement: 82
        },
        changes: ['Revised headline', 'Optimized images'],
        isActive: false,
        mlScore: 88
      },
      {
        id: '3',
        version: 'v3.0',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        performance: {
          openRate: 22.7,
          clickRate: 3.4,
          conversionRate: 2.1,
          engagement: 79
        },
        changes: ['Initial version'],
        isActive: false,
        mlScore: 82
      }
    ];

    const mockRecommendations: TemplateRecommendation[] = [
      {
        id: '1',
        title: 'Personalized Header Image',
        description: 'Add dynamic header images based on user preferences and behavior',
        impact: 'high',
        confidence: 89,
        category: 'design',
        preview: 'Dynamic hero images increase engagement by 34%',
        estimatedImprovement: 15
      },
      {
        id: '2',
        title: 'Interactive CTA Button',
        description: 'Replace static button with animated hover effects and urgency indicators',
        impact: 'high',
        confidence: 92,
        category: 'cta',
        preview: 'Animated CTAs show 28% higher click rates',
        estimatedImprovement: 12
      },
      {
        id: '3',
        title: 'Smart Content',
        description: 'Reorganize content based on user reading patterns',
        impact: 'medium',
        confidence: 76,
        category: 'layout',
        preview: 'Optimized layout reduces bounce rate by 18%',
        estimatedImprovement: 8
      },
      {
        id: '4',
        title: 'Contextual Product Recommendations',
        description: 'Add AI-powered product suggestions based on user history',
        impact: 'high',
        confidence: 85,
        category: 'content',
        preview: 'Personalized recommendations boost conversions by 31%',
        estimatedImprovement: 18
      }
    ];

    setVersions(mockVersions);
    setRecommendations(mockRecommendations);
  };

  const analyzePerformance = async () => {
    setIsAnalyzing(true);
    
    // Simulate ML analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate new recommendations based on current performance
    const newRecommendations = recommendations.map(rec => ({
      ...rec,
      confidence: Math.min(100, rec.confidence + Math.random() * 5)
    }));
    
    setRecommendations(newRecommendations);
    setIsAnalyzing(false);
  };

  const applyRecommendation = (recommendation: TemplateRecommendation) => {
    if (!editor) return;

    // Simulate applying the recommendation
    console.log(`Applying recommendation: ${recommendation.title}`);
    
    // Remove applied recommendation
    setRecommendations(prev => prev.filter(r => r.id !== recommendation.id));
    
    // Create new version
    const newVersion: TemplateVersion = {
      id: String(Date.now()),
      version: `v${versions.length + 1}.0`,
      createdAt: new Date(),
      performance: {
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
        engagement: 0
      },
      changes: [recommendation.title],
      isActive: true,
      mlScore: 95
    };
    
    setVersions(prev => [newVersion, ...prev.map(v => ({ ...v, isActive: false }))]);
  };

  const rollbackToVersion = (versionId: string) => {
    setVersions(prev => prev.map(v => ({
      ...v,
      isActive: v.id === versionId
    })));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'layout': return <BarChart3 className="w-4 h-4" />;
      case 'content': return <Eye className="w-4 h-4" />;
      case 'design': return <Sparkles className="w-4 h-4" />;
      case 'cta': return <ArrowRight className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Template Evolution</h3>
          <Badge variant="secondary" className="ml-auto bg-green-50 text-green-700">
            ML Powered
          </Badge>
        </div>

        <div className="flex gap-1">
          {[
            { id: 'recommendations', label: 'AI Suggestions', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'versions', label: 'Versions', icon: <GitBranch className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
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

      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">AI Recommendations</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzePerformance}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  {isAnalyzing ? 'Analyzing...' : 'Refresh'}
                </Button>
              </div>

              <div className="space-y-3">
                {recommendations.map((recommendation) => (
                  <Card key={recommendation.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(recommendation.category)}
                        <span className="font-medium text-sm">{recommendation.title}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getImpactColor(recommendation.impact)}`}
                        >
                          {recommendation.impact}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star className="w-3 h-3" />
                        {recommendation.confidence}%
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {recommendation.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-blue-600 italic">
                        💡 {recommendation.preview}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        +{recommendation.estimatedImprovement}% improvement
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => applyRecommendation(recommendation)}
                        className="flex-1"
                      >
                        Apply Recommendation
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {recommendations.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">All recommendations applied!</p>
                    <p className="text-xs text-gray-500 mt-1">Template is fully optimized.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Version History</h4>
              
              <div className="space-y-3">
                {versions.map((version) => (
                  <Card key={version.id} className={`p-4 ${version.isActive ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{version.version}</span>
                        {version.isActive && (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Score: {version.mlScore}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {version.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
                      <div className="text-center">
                        <div className="font-medium">{version.performance.openRate}%</div>
                        <div className="text-gray-500">Open Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{version.performance.clickRate}%</div>
                        <div className="text-gray-500">Click Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{version.performance.conversionRate}%</div>
                        <div className="text-gray-500">Conversion</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{version.performance.engagement}</div>
                        <div className="text-gray-500">Engagement</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-1">Changes:</div>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {version.changes.map((change, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {!version.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rollbackToVersion(version.id)}
                        className="w-full"
                      >
                        <GitBranch className="w-4 h-4 mr-2" />
                        Rollback to this version
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Performance Analytics</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Engagement Trend</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">+12.5%</div>
                  <div className="text-xs text-gray-600">vs. last month</div>
                </Card>
                
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Conversion Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">2.8%</div>
                  <div className="text-xs text-gray-600">+0.5% this week</div>
                </Card>
              </div>
              
              <Card className="p-4">
                <h5 className="font-medium text-sm mb-3">ML Performance Score</h5>
                <div className="flex items-center gap-3">
                  <Progress value={94} className="flex-1" />
                  <span className="text-sm font-medium">94/100</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Your template is performing excellently based on ML analysis
                </p>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
