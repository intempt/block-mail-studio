
import React from 'react';
import { RibbonGroup } from '../RibbonGroup';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart3, Eye, Link } from 'lucide-react';

interface ReviewTabProps {
  emailHTML: string;
  subjectLine: string;
  canvasRef: React.RefObject<any>;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  emailHTML,
  subjectLine,
  canvasRef
}) => {
  const handleOptimizeImages = () => {
    if (canvasRef.current) {
      canvasRef.current.optimizeImages();
    }
  };

  const handleCheckLinks = () => {
    if (canvasRef.current) {
      const results = canvasRef.current.checkLinks();
      alert(`Links checked: ${results.workingLinks} working, ${results.brokenLinks} broken`);
    }
  };

  const handleMinifyHTML = () => {
    if (canvasRef.current) {
      canvasRef.current.minifyHTML();
    }
  };

  return (
    <div className="review-tab flex items-stretch bg-white border-b border-gray-100">
      {/* Performance Group */}
      <RibbonGroup title="Performance">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3" onClick={handleOptimizeImages}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Optimize
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={handleCheckLinks}>
              <Link className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={handleMinifyHTML}>
              Minify
            </Button>
          </div>
        </div>
      </RibbonGroup>

      {/* Analytics Group */}
      <RibbonGroup title="Analytics">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <BarChart3 className="w-4 h-4 mr-1" />
            A/B Test
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Metrics
          </Button>
        </div>
      </RibbonGroup>

      {/* Testing Group */}
      <RibbonGroup title="Testing">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Send Test
          </Button>
        </div>
      </RibbonGroup>

      {/* Quality Group */}
      <RibbonGroup title="Quality">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-3">
            Accessibility
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-3">
            Readability
          </Button>
        </div>
      </RibbonGroup>
    </div>
  );
};
