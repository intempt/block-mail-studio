
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { 
  Type,
  Timer,
  Image,
  Link,
  Target,
  Globe,
  Clock,
  Smartphone,
  Eye,
  Shield,
  Mail,
  MessageSquare,
  User,
  TrendingUp,
  Star,
  Layout,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { ComprehensiveEmailMetrics, ComprehensiveMetricsService } from '@/services/comprehensiveMetricsService';
import { EmailProviderCompatibilityCard } from '@/components/EmailProviderCompatibilityCard';

interface MetricsPanelProps {
  comprehensiveMetrics: ComprehensiveEmailMetrics | null;
  emailHTML: string;
  subjectLine: string;
  canvasWidth: number;
  previewMode: 'desktop' | 'mobile';
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  comprehensiveMetrics,
  emailHTML,
  subjectLine,
  canvasWidth,
  previewMode
}) => {
  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
        {/* Header */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Email Metrics</span>
          </div>
        </div>

        {/* Canvas Info */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              {previewMode === 'desktop' ? 
                <Smartphone className="w-4 h-4" /> : 
                <Smartphone className="w-4 h-4" />
              }
              <span>{canvasWidth}px</span>
            </div>
          </div>
        </div>

        {/* Comprehensive Metrics */}
        {comprehensiveMetrics && (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Content Group */}
            <Card className="p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Type className="w-3 h-3" />
                Content
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-blue-50 rounded border border-blue-100 cursor-help hover:bg-blue-100 transition-colors">
                      <Type className="w-3 h-3 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-bold text-blue-600">{comprehensiveMetrics.wordCount}</div>
                      <div className="text-xs text-gray-600">Words</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total word count. Optimal: 150-300 words</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-green-50 rounded border border-green-100 cursor-help hover:bg-green-100 transition-colors">
                      <Timer className="w-3 h-3 mx-auto mb-1 text-green-600" />
                      <div className="text-sm font-bold text-green-600">{comprehensiveMetrics.readTimeMinutes}m</div>
                      <div className="text-xs text-gray-600">Read Time</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated reading time (200 wpm)</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-purple-50 rounded border border-purple-100 cursor-help hover:bg-purple-100 transition-colors">
                      <Image className="w-3 h-3 mx-auto mb-1 text-purple-600" />
                      <div className="text-sm font-bold text-purple-600">{comprehensiveMetrics.imageCount}</div>
                      <div className="text-xs text-gray-600">Images</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of images. Affects loading time</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-indigo-50 rounded border border-indigo-100 cursor-help hover:bg-indigo-100 transition-colors">
                      <Link className="w-3 h-3 mx-auto mb-1 text-indigo-600" />
                      <div className="text-sm font-bold text-indigo-600">{comprehensiveMetrics.linkCount}</div>
                      <div className="text-xs text-gray-600">Links</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clickable links. Too many can trigger spam filters</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Card>

            {/* Performance Group */}
            <Card className="p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Performance
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-gray-50 rounded border border-gray-100 cursor-help hover:bg-gray-100 transition-colors">
                      <Globe className="w-3 h-3 mx-auto mb-1 text-gray-600" />
                      <div className={`text-sm font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.sizeKB, 'size')}`}>
                        {comprehensiveMetrics.sizeKB}KB
                      </div>
                      <div className="text-xs text-gray-600">Size</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Email file size. Keep under 100KB</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-100 cursor-help hover:bg-yellow-100 transition-colors">
                      <Clock className="w-3 h-3 mx-auto mb-1 text-yellow-600" />
                      <div className="text-sm font-bold text-yellow-600">{comprehensiveMetrics.loadTimeEstimate}</div>
                      <div className="text-xs text-gray-600">Load Time</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated loading time</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-pink-50 rounded border border-pink-100 cursor-help hover:bg-pink-100 transition-colors">
                      <Smartphone className="w-3 h-3 mx-auto mb-1 text-pink-600" />
                      <div className={`text-sm font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.mobileScore, 'score')}`}>
                        {comprehensiveMetrics.mobileScore}
                      </div>
                      <div className="text-xs text-gray-600">Mobile</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mobile-friendliness score out of 100</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-teal-50 rounded border border-teal-100 cursor-help hover:bg-teal-100 transition-colors">
                      <Eye className="w-3 h-3 mx-auto mb-1 text-teal-600" />
                      <div className={`text-sm font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.accessibilityScore, 'score')}`}>
                        {comprehensiveMetrics.accessibilityScore}
                      </div>
                      <div className="text-xs text-gray-600">A11y</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accessibility score for screen readers</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Card>

            {/* Deliverability Group */}
            <Card className="p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Deliverability
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-red-50 rounded border border-red-100 cursor-help hover:bg-red-100 transition-colors">
                      <Shield className="w-3 h-3 mx-auto mb-1 text-red-600" />
                      <div className={`text-sm font-bold ${ComprehensiveMetricsService.getMetricColor(100 - comprehensiveMetrics.spamScore, 'score')}`}>
                        {comprehensiveMetrics.spamScore}%
                      </div>
                      <div className="text-xs text-gray-600">Spam Risk</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Spam risk percentage. Lower is better</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-emerald-50 rounded border border-emerald-100 cursor-help hover:bg-emerald-100 transition-colors">
                      <Mail className="w-3 h-3 mx-auto mb-1 text-emerald-600" />
                      <div className={`text-sm font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.deliverabilityScore, 'score')}`}>
                        {comprehensiveMetrics.deliverabilityScore}
                      </div>
                      <div className="text-xs text-gray-600">Deliver</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Deliverability score out of 100</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 bg-cyan-50 rounded border border-cyan-100 cursor-help hover:bg-cyan-100 transition-colors">
                      <MessageSquare className="w-3 h-3 mx-auto mb-1 text-cyan-600" />
                      <div className={`text-sm font-bold ${ComprehensiveMetricsService.getMetricColor(comprehensiveMetrics.subjectLineScore, 'score')}`}>
                        {comprehensiveMetrics.subjectLineScore}
                      </div>
                      <div className="text-xs text-gray-600">Subject</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Subject line effectiveness score</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Card>

            {/* Email Provider Compatibility */}
            {emailHTML.trim() && (
              <EmailProviderCompatibilityCard
                emailHTML={emailHTML}
                subjectLine={subjectLine}
              />
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
