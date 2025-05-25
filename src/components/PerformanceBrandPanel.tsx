
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Target, TrendingUp } from 'lucide-react';
import { EnhancedPerformanceAnalyzer } from './EnhancedPerformanceAnalyzer';
import { BrandVoiceOptimizer } from './BrandVoiceOptimizer';
import { useToast } from '@/hooks/use-toast';

interface PerformanceBrandPanelProps {
  emailHTML: string;
  subjectLine: string;
  editor?: any;
}

export const PerformanceBrandPanel: React.FC<PerformanceBrandPanelProps> = ({
  emailHTML,
  subjectLine,
  editor
}) => {
  const [activeTab, setActiveTab] = useState('performance');
  const { toast } = useToast();

  const handleOptimize = (suggestion: string) => {
    console.log('Applying optimization:', suggestion);
    toast({
      title: "Optimization Applied",
      description: suggestion
    });
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="brand" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Brand Voice
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="flex-1 overflow-hidden">
          <EnhancedPerformanceAnalyzer
            emailHTML={emailHTML}
            subjectLine={subjectLine}
            onOptimize={handleOptimize}
          />
        </TabsContent>
        
        <TabsContent value="brand" className="flex-1 overflow-hidden">
          <BrandVoiceOptimizer
            editor={editor}
            emailHTML={emailHTML}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
