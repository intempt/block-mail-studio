
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, ZoomIn, ZoomOut, BarChart3, Brain, TrendingUp, Shield } from 'lucide-react';

interface PerformanceMetrics {
  overallScore: number | null;
  deliverabilityScore: number | null;
  mobileScore: number | null;
  spamScore: number | null;
}

interface BrandMetrics {
  brandVoiceScore: number;
  engagementScore: number;
  toneConsistency: number;
  readabilityScore: number;
}

interface PerformancePrediction {
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

interface StatusBarProps {
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
  blockCount?: number;
  wordCount?: number;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  performanceMetrics?: PerformanceMetrics;
  brandMetrics?: BrandMetrics;
  performancePrediction?: PerformancePrediction;
  onRefreshAnalysis?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  canvasWidth,
  previewMode,
  blockCount = 0,
  wordCount = 0,
  zoom = 100,
  onZoomChange,
  performanceMetrics,
  brandMetrics,
  performancePrediction,
  onRefreshAnalysis
}) => {
  const handleZoomIn = () => {
    if (onZoomChange && zoom < 200) {
      onZoomChange(zoom + 25);
    }
  };

  const handleZoomOut = () => {
    if (onZoomChange && zoom > 50) {
      onZoomChange(zoom - 25);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
      {/* Left: Canvas Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {previewMode === 'desktop' ? 
            <Monitor className="w-4 h-4" /> : 
            <Smartphone className="w-4 h-4" />
          }
          <span>{canvasWidth}px</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {blockCount} blocks
          </Badge>
          <Badge variant="outline" className="text-xs">
            {wordCount} words
          </Badge>
        </div>
      </div>

      {/* Center: Performance & Brand Metrics */}
      <div className="flex items-center gap-6">
        {/* Performance Scores */}
        {performanceMetrics && (
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <div className="flex items-center gap-2">
              <span className="text-xs">Performance:</span>
              <Badge variant="outline" className={`text-xs ${getScoreColor(performanceMetrics.overallScore)}`}>
                {performanceMetrics.overallScore || '--'}/100
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs">Deliverability:</span>
              <span className={`text-xs font-medium ${getScoreColor(performanceMetrics.deliverabilityScore)}`}>
                {performanceMetrics.deliverabilityScore || '--'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs">Mobile:</span>
              <span className={`text-xs font-medium ${getScoreColor(performanceMetrics.mobileScore)}`}>
                {performanceMetrics.mobileScore || '--'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span className={`text-xs font-medium ${performanceMetrics.spamScore !== null ? performanceMetrics.spamScore > 20 ? 'text-red-600' : 'text-green-600' : 'text-gray-600'}`}>
                {performanceMetrics.spamScore !== null ? `${performanceMetrics.spamScore}% spam` : '--'}
              </span>
            </div>
          </div>
        )}

        {/* Brand Voice Scores */}
        {brandMetrics && (
          <div className="flex items-center gap-3">
            <div className="h-4 w-px bg-gray-300" />
            <Brain className="w-4 h-4 text-purple-600" />
            <div className="flex items-center gap-2">
              <span className="text-xs">Brand Voice:</span>
              <Badge variant="outline" className={`text-xs ${getScoreColor(brandMetrics.brandVoiceScore)}`}>
                {brandMetrics.brandVoiceScore}/100
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs">Engagement:</span>
              <span className={`text-xs font-medium ${getScoreColor(brandMetrics.engagementScore)}`}>
                {brandMetrics.engagementScore}
              </span>
            </div>
          </div>
        )}

        {/* Performance Predictions */}
        {performancePrediction && (performancePrediction.openRate > 0 || performancePrediction.clickRate > 0) && (
          <div className="flex items-center gap-3">
            <div className="h-4 w-px bg-gray-300" />
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div className="flex items-center gap-3 text-xs">
              <span>Predicted: Open {performancePrediction.openRate}%</span>
              <span>Click {performancePrediction.clickRate}%</span>
              <span>Convert {performancePrediction.conversionRate}%</span>
            </div>
          </div>
        )}

        {/* Refresh Analysis Button */}
        {onRefreshAnalysis && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefreshAnalysis}
            className="h-6 px-2 text-xs"
          >
            Refresh
          </Button>
        )}
      </div>
      
      {/* Right: Zoom Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className="h-6 w-6 p-0"
        >
          <ZoomOut className="w-3 h-3" />
        </Button>
        <span className="min-w-[50px] text-center">{zoom}%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          className="h-6 w-6 p-0"
        >
          <ZoomIn className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
