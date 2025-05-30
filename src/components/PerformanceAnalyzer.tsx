import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Mail, 
  Smartphone, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Image as ImageIcon,
  Link,
  Palette
} from 'lucide-react';

interface PerformanceAnalyzerProps {
  emailHTML: string;
  subjectLine: string;
  canvasRef?: React.RefObject<any>;
}

interface PerformanceMetric {
  name: string;
  score: number;
  status: 'good' | 'warning' | 'critical';
  details?: string;
}

interface PerformanceReport {
  overallScore: number;
  metrics: PerformanceMetric[];
  fileSize: string;
  imageCount: number;
  linkCount: number;
  loadTime: string;
  recommendations: string[];
}

const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({
  emailHTML,
  subjectLine,
  canvasRef
}) => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

  useEffect(() => {
    if (emailHTML) {
      analyzePerformance();
    }
  }, [emailHTML]);

  const handleOptimizeImages = () => {
    console.log('Image optimization would be implemented here');
    // Note: Removed canvasRef.current.optimizeImages() as it doesn't exist
  };

  const handleMinifyHTML = () => {
    console.log('HTML minification would be implemented here');
    // Note: Removed canvasRef.current.minifyHTML() as it doesn't exist
  };

  const handleCheckLinks = async () => {
    console.log('Link checking would be implemented here');
    // Note: Removed canvasRef.current.checkLinks() as it doesn't exist
  };

  const analyzePerformance = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // Calculate file size
      const fileSize = new Blob([emailHTML]).size;
      const fileSizeFormatted = fileSize < 1024 
        ? `${fileSize} bytes` 
        : `${(fileSize / 1024).toFixed(1)} KB`;
      
      // Count images
      const imgRegex = /<img[^>]+>/g;
      const imageMatches = emailHTML.match(imgRegex) || [];
      const imageCount = imageMatches.length;
      
      // Count links
      const linkRegex = /<a[^>]+>/g;
      const linkMatches = emailHTML.match(linkRegex) || [];
      const linkCount = linkMatches.length;
      
      // Estimate load time (simplified)
      const estimatedLoadTime = Math.max(0.5, fileSize / 50000); // Rough estimate
      const loadTimeFormatted = `${estimatedLoadTime.toFixed(1)}s`;
      
      // Check for common issues
      const hasAltText = !/<img[^>]+alt="[^"]*"[^>]*>/g.test(emailHTML);
      const hasLargeImages = imageCount > 0 && fileSize / imageCount > 50000;
      const subjectLength = subjectLine ? subjectLine.length : 0;
      const hasGoodSubjectLength = subjectLength > 0 && subjectLength < 50;
      
      // Generate metrics
      const metrics: PerformanceMetric[] = [
        {
          name: 'File Size',
          score: fileSize < 70000 ? 100 : fileSize < 102400 ? 70 : 40,
          status: fileSize < 70000 ? 'good' : fileSize < 102400 ? 'warning' : 'critical',
          details: `Email is ${fileSizeFormatted}. ${
            fileSize < 70000 
              ? 'Good size for fast loading.' 
              : 'Consider optimizing to improve load times.'
          }`
        },
        {
          name: 'Image Optimization',
          score: !hasLargeImages ? 100 : 60,
          status: !hasLargeImages ? 'good' : 'warning',
          details: `${imageCount} images detected. ${
            !hasLargeImages 
              ? 'Images appear to be well-optimized.' 
              : 'Some images may be too large.'
          }`
        },
        {
          name: 'Accessibility',
          score: hasAltText ? 100 : 50,
          status: hasAltText ? 'good' : 'warning',
          details: hasAltText 
            ? 'All images have alt text.' 
            : 'Some images may be missing alt text.'
        },
        {
          name: 'Subject Line',
          score: hasGoodSubjectLength ? 90 : subjectLength > 0 ? 60 : 30,
          status: hasGoodSubjectLength ? 'good' : subjectLength > 0 ? 'warning' : 'critical',
          details: subjectLength === 0 
            ? 'Missing subject line.' 
            : subjectLength > 50 
              ? 'Subject line may be too long.' 
              : 'Subject line length is good.'
        }
      ];
      
      // Calculate overall score
      const overallScore = Math.round(
        metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length
      );
      
      // Generate recommendations
      const recommendations = [];
      if (fileSize > 102400) recommendations.push('Reduce email size to improve load times');
      if (hasLargeImages) recommendations.push('Optimize images to reduce file size');
      if (!hasAltText) recommendations.push('Add alt text to all images for better accessibility');
      if (subjectLength === 0) recommendations.push('Add a subject line');
      if (subjectLine && subjectLine.length > 50) recommendations.push('Shorten subject line for better open rates');
      if (linkCount === 0) recommendations.push('Consider adding at least one call-to-action link');
      
      setReport({
        overallScore,
        metrics,
        fileSize: fileSizeFormatted,
        imageCount,
        linkCount,
        loadTime: loadTimeFormatted,
        recommendations
      });
      
      setIsAnalyzing(false);
    }, 1000);
  };

  if (!report) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Email Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-100 rounded"></div>
          </div>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={analyzePerformance}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Performance'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Email Performance
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('overview')}
              className="h-7 text-xs"
            >
              Overview
            </Button>
            <Button 
              variant={activeTab === 'details' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('details')}
              className="h-7 text-xs"
            >
              Details
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'overview' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Overall Score</div>
                <div className="text-3xl font-bold">{report.overallScore}/100</div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                <span className="text-xl font-bold">{report.overallScore}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium">Size</span>
                </div>
                <div className="text-sm font-bold">{report.fileSize}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium">Images</span>
                </div>
                <div className="text-sm font-bold">{report.imageCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Link className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium">Links</span>
                </div>
                <div className="text-sm font-bold">{report.linkCount}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Recommendations</div>
              {report.recommendations.length > 0 ? (
                <ul className="space-y-1">
                  {report.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>No issues detected!</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={handleOptimizeImages} className="text-xs">
                <ImageIcon className="w-3 h-3 mr-1" />
                Optimize Images
              </Button>
              <Button size="sm" variant="outline" onClick={handleMinifyHTML} className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Minify HTML
              </Button>
              <Button size="sm" variant="outline" onClick={handleCheckLinks} className="text-xs">
                <Link className="w-3 h-3 mr-1" />
                Check Links
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {report.metrics.map((metric, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{metric.name}</div>
                    <Badge variant={
                      metric.status === 'good' ? 'outline' : 
                      metric.status === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {metric.score}/100
                    </Badge>
                  </div>
                  <Progress value={metric.score} className="h-1.5" />
                  <div className="text-xs text-gray-500">{metric.details}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3">
              <div className="text-sm font-medium mb-2">Technical Details</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Estimated Load Time:</span>
                  <span className="font-medium">{report.loadTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">File Size:</span>
                  <span className="font-medium">{report.fileSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Images:</span>
                  <span className="font-medium">{report.imageCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Links:</span>
                  <span className="font-medium">{report.linkCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Subject Length:</span>
                  <span className="font-medium">{subjectLine ? subjectLine.length : 0} chars</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={analyzePerformance} className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Re-analyze
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceAnalyzer;
