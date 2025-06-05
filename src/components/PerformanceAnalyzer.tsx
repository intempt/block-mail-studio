import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Mail,
  Smartphone,
  Monitor,
  BarChart3,
  Eye,
  Clock,
  Users,
  MousePointer
} from 'lucide-react';
import { EmailBlockCanvasRef } from './EmailBlockCanvas';

interface PerformanceAnalyzerProps {
  emailHTML: string;
  subjectLine: string;
}

export const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({ emailHTML, subjectLine }) => {
  // Placeholder data - replace with actual analysis
  const openRate = 45;
  const clickThroughRate = 8;
  const conversionRate = 3;
  const deliverabilityScore = 92;
  const spamScore = 2;
  const mobileFriendliness = 95;
  const desktopFriendliness = 88;
  const aiEngagementScore = 78;
  const readTime = 15;
  const wordCount = 185;
  const subscriberEngagement = 67;
  const optimalSendingTime = '9:00 AM - 11:00 AM';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Key Metrics */}
      <Card className="bg-white shadow-md">
        <div className="flex items-center space-x-4 p-4">
          <TrendingUp className="text-green-500 w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Engagement</h3>
            <p className="text-sm text-gray-500">Open Rate: {openRate}%</p>
            <Progress value={openRate} max={100} className="mt-1" />
            <p className="text-sm text-gray-500">Click-Through Rate: {clickThroughRate}%</p>
            <Progress value={clickThroughRate} max={100} className="mt-1" />
            <p className="text-sm text-gray-500">Conversion Rate: {conversionRate}%</p>
            <Progress value={conversionRate} max={100} className="mt-1" />
          </div>
        </div>
      </Card>

      {/* Deliverability */}
      <Card className="bg-white shadow-md">
        <div className="flex items-center space-x-4 p-4">
          <Target className="text-blue-500 w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Deliverability</h3>
            <p className="text-sm text-gray-500">Deliverability Score: {deliverabilityScore}%</p>
            <Progress value={deliverabilityScore} max={100} className="mt-1" />
            <p className="text-sm text-gray-500">Spam Score: {spamScore}%</p>
            <Progress value={spamScore} max={100} className="mt-1" />
          </div>
        </div>
      </Card>

      {/* Friendliness */}
      <Card className="bg-white shadow-md">
        <div className="flex items-center space-x-4 p-4">
          <Zap className="text-yellow-500 w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Friendliness</h3>
            <p className="text-sm text-gray-500">Mobile: {mobileFriendliness}%</p>
            <Progress value={mobileFriendliness} max={100} className="mt-1" />
            <p className="text-sm text-gray-500">Desktop: {desktopFriendliness}%</p>
            <Progress value={desktopFriendliness} max={100} className="mt-1" />
          </div>
        </div>
      </Card>

      {/* AI Engagement */}
      <Card className="bg-white shadow-md">
        <div className="flex items-center space-x-4 p-4">
          <Eye className="text-purple-500 w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">AI Engagement</h3>
            <p className="text-sm text-gray-500">AI Engagement Score: {aiEngagementScore}%</p>
            <Progress value={aiEngagementScore} max={100} className="mt-1" />
            <p className="text-sm text-gray-500">Read Time: {readTime} seconds</p>
            <p className="text-sm text-gray-500">Word Count: {wordCount} words</p>
          </div>
        </div>
      </Card>

      {/* Subscriber Engagement */}
      <Card className="bg-white shadow-md">
        <div className="flex items-center space-x-4 p-4">
          <Users className="text-orange-500 w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Subscriber Engagement</h3>
            <p className="text-sm text-gray-500">Engagement Score: {subscriberEngagement}%</p>
            <Progress value={subscriberEngagement} max={100} className="mt-1" />
            <p className="text-sm text-gray-500">Optimal Sending Time: {optimalSendingTime}</p>
          </div>
        </div>
      </Card>

      {/* Call to Action Analysis */}
      <Card className="bg-white shadow-md">
        <div className="flex items-center space-x-4 p-4">
          <MousePointer className="text-teal-500 w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Call to Action</h3>
            <p className="text-sm text-gray-500">Analyze your call to action effectiveness.</p>
            <Button variant="outline" size="sm" className="mt-2">
              Analyze CTA
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
