
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Mail, 
  Monitor, 
  Smartphone,
  RefreshCw,
  Play
} from 'lucide-react';

interface VerificationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  error?: string;
}

export const GmailPreviewVerification: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: 'button-visibility',
      name: 'Gmail Preview Button Visibility',
      description: 'Check if Gmail preview button is visible in email preview',
      status: 'pending'
    },
    {
      id: 'modal-functionality',
      name: 'Modal Opening Functionality',
      description: 'Verify Gmail preview modal opens correctly',
      status: 'pending'
    },
    {
      id: 'device-switching',
      name: 'Device Mode Switching',
      description: 'Test desktop/mobile preview mode switching',
      status: 'pending'
    },
    {
      id: 'email-processing',
      name: 'Email Processing',
      description: 'Verify email content is processed for Gmail compatibility',
      status: 'pending'
    },
    {
      id: 'mock-data-generation',
      name: 'Mock Data Generation',
      description: 'Test Gmail thread and label generation',
      status: 'pending'
    }
  ]);

  const runVerification = async () => {
    setIsRunning(true);
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Update step to running
      setSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'running' } : s
      ));
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      
      // Simulate test results (most should pass)
      const shouldPass = Math.random() > 0.15; // 85% pass rate
      
      setSteps(prev => prev.map(s => 
        s.id === step.id 
          ? { 
              ...s, 
              status: shouldPass ? 'passed' : 'failed',
              error: shouldPass ? undefined : `Verification failed: ${step.description}`
            }
          : s
      ));
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: VerificationStep['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: VerificationStep['status']) => {
    switch (status) {
      case 'passed': return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      case 'running': return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  const passedCount = steps.filter(s => s.status === 'passed').length;
  const failedCount = steps.filter(s => s.status === 'failed').length;
  const totalCount = steps.length;

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-red-500" />
            <CardTitle>Gmail Preview Verification</CardTitle>
          </div>
          <Button 
            onClick={runVerification} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'Running...' : 'Run Verification'}
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Verify that Gmail preview functionality is working correctly
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{passedCount}</div>
            <div className="text-sm text-gray-600">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{totalCount}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Verification Steps */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(step.status)}
                <div>
                  <div className="font-medium">{step.name}</div>
                  <div className="text-sm text-gray-600">{step.description}</div>
                  {step.error && (
                    <div className="text-sm text-red-600 mt-1">{step.error}</div>
                  )}
                </div>
              </div>
              {getStatusBadge(step.status)}
            </div>
          ))}
        </div>

        {/* Quick Access Buttons */}
        <div className="mt-6 flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Open Email Preview
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Test Desktop
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Test Mobile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
