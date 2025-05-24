
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wifi, 
  WifiOff,
  Brain,
  MessageSquare,
  BarChart3,
  Target,
  Mail,
  Sparkles,
  RefreshCw,
  Play,
  AlertTriangle,
  Info
} from 'lucide-react';
import { OpenAIEmailService } from '@/services/openAIEmailService';
import { EmailAIService } from '@/services/EmailAIService';
import { ApiKeyService } from '@/services/apiKeyService';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number;
  error?: string;
  details?: string;
}

export const AITestingSuite: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');

  const testSampleContent = {
    emailHTML: `<div class="email-container">
      <div class="email-block header-block">
        <h1 style="color: #1F2937; font-size: 24px; margin: 0; padding: 24px;">Welcome to Our Service!</h1>
      </div>
      <div class="email-block paragraph-block">
        <p style="color: #374151; line-height: 1.7; margin: 0; padding: 16px 24px;">
          Thank you for joining us. We're excited to have you on board and can't wait to show you what we can do together.
        </p>
      </div>
      <div class="email-block button-block" style="text-align: center; padding: 24px;">
        <a href="#" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Get Started
        </a>
      </div>
    </div>`,
    subjectLine: 'Welcome to Our Amazing Service - Get Started Today!'
  };

  const tests: Omit<TestResult, 'status'>[] = [
    { id: 'api-key', name: 'API Key Configuration', message: 'Verify OpenAI API key is properly configured' },
    { id: 'api-connectivity', name: 'OpenAI API Connectivity', message: 'Test basic connection to OpenAI servers' },
    { id: 'email-generation', name: 'Email Content Generation', message: 'Generate complete email using AI' },
    { id: 'brand-voice-analysis', name: 'Brand Voice Analysis', message: 'Analyze email content for brand consistency' },
    { id: 'performance-analysis', name: 'Performance Analysis', message: 'Technical performance and deliverability analysis' },
    { id: 'subject-line-optimization', name: 'Subject Line Optimization', message: 'Generate and analyze subject line variations' },
    { id: 'content-refinement', name: 'Content Refinement', message: 'Optimize existing email content' },
    { id: 'conversational-ai', name: 'Conversational AI Response', message: 'Test chat-based AI assistance' }
  ];

  const updateTestResult = (id: string, updates: Partial<TestResult>) => {
    setTestResults(prev => prev.map(test => 
      test.id === id ? { ...test, ...updates } : test
    ));
  };

  const runTest = async (test: Omit<TestResult, 'status'>) => {
    const startTime = Date.now();
    setCurrentTest(test.id);
    updateTestResult(test.id, { status: 'running' });

    try {
      let result;
      let details = '';
      
      switch (test.id) {
        case 'api-key':
          const keyStatus = ApiKeyService.getKeyStatus();
          if (keyStatus !== 'valid') {
            throw new Error(`API key status: ${keyStatus}`);
          }
          result = 'API key is properly configured and valid';
          details = `Key status: ${keyStatus}, Available: ${ApiKeyService.isKeyAvailable()}`;
          break;

        case 'api-connectivity':
          console.log('Testing OpenAI connectivity...');
          result = await OpenAIEmailService.conversationalResponse({
            userMessage: 'Test connection - respond with "Connection successful"',
            conversationContext: [],
            currentEmailContent: ''
          });
          details = `Response received: ${typeof result === 'string' ? result.slice(0, 100) : 'Valid response'}`;
          break;

        case 'email-generation':
          console.log('Testing email generation...');
          result = await EmailAIService.generateEmail({
            prompt: 'Create a professional welcome email for a SaaS platform',
            tone: 'professional',
            type: 'welcome'
          });
          details = `Generated email with subject: ${result.subject || 'No subject'}`;
          break;

        case 'brand-voice-analysis':
          console.log('Testing brand voice analysis...');
          result = await EmailAIService.analyzeBrandVoice(
            testSampleContent.emailHTML,
            testSampleContent.subjectLine
          );
          details = `Brand voice score: ${result.brandVoiceScore}, Engagement: ${result.engagementScore}`;
          break;

        case 'performance-analysis':
          console.log('Testing performance analysis...');
          result = await EmailAIService.analyzeEmailPerformance(
            testSampleContent.emailHTML,
            testSampleContent.subjectLine
          );
          details = `Overall score: ${result.overallScore}, Deliverability: ${result.deliverabilityScore}`;
          break;

        case 'subject-line-optimization':
          console.log('Testing subject line optimization...');
          result = await EmailAIService.analyzeSubjectLine(
            testSampleContent.subjectLine,
            testSampleContent.emailHTML
          );
          details = `Generated ${result.suggestions?.length || 0} suggestions, Score: ${result.score}`;
          break;

        case 'content-refinement':
          console.log('Testing content refinement...');
          result = await EmailAIService.refineEmail(
            testSampleContent.emailHTML,
            'Make this email more engaging and add urgency'
          );
          details = `Content refined successfully, length: ${typeof result === 'string' ? result.length : 'N/A'} chars`;
          break;

        case 'conversational-ai':
          console.log('Testing conversational AI...');
          result = await EmailAIService.getConversationalResponse(
            'Help me create a product announcement email',
            []
          );
          details = `Response length: ${typeof result === 'string' ? result.length : 'N/A'} characters`;
          break;

        default:
          throw new Error('Unknown test');
      }

      const duration = Date.now() - startTime;
      updateTestResult(test.id, { 
        status: 'success', 
        message: `✅ Test passed successfully`,
        details,
        duration 
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Test ${test.id} failed:`, error);
      
      updateTestResult(test.id, { 
        status: 'error', 
        message: `❌ Test failed`,
        error: errorMessage,
        details: `Error after ${duration}ms: ${errorMessage}`,
        duration 
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    
    // Initialize all tests as pending
    const initialResults = tests.map(test => ({ ...test, status: 'pending' as const }));
    setTestResults(initialResults);

    let hasFailures = false;

    // Run tests sequentially with delays
    for (const test of tests) {
      try {
        await runTest(test);
        // Add delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        hasFailures = true;
        console.error(`Test ${test.id} failed:`, error);
      }
    }

    setCurrentTest(null);
    setIsRunning(false);
    setOverallStatus(hasFailures ? 'failed' : 'completed');
  };

  const runSingleTest = async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    setIsRunning(true);
    
    // Update only this test
    const initialResult = { ...test, status: 'pending' as const };
    setTestResults(prev => prev.map(t => t.id === testId ? initialResult : t));

    try {
      await runTest(test);
    } catch (error) {
      console.error(`Single test ${testId} failed:`, error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'border-gray-200 bg-gray-50';
      case 'running': return 'border-blue-200 bg-blue-50';
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
    }
  };

  const successCount = testResults.filter(t => t.status === 'success').length;
  const failureCount = testResults.filter(t => t.status === 'error').length;
  const totalTests = tests.length;
  const completedTests = successCount + failureCount;
  const progressPercentage = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Testing Suite
            </h2>
            <p className="text-sm text-gray-600">Comprehensive OpenAI integration testing</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={ApiKeyService.isKeyAvailable() ? 'default' : 'destructive'} className="flex items-center gap-1">
              {ApiKeyService.isKeyAvailable() ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {ApiKeyService.isKeyAvailable() ? 'API Connected' : 'API Not Available'}
            </Badge>
            
            <Button 
              onClick={runAllTests} 
              disabled={isRunning || !ApiKeyService.isKeyAvailable()}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {currentTest ? `Running: ${tests.find(t => t.id === currentTest)?.name}` : 'Preparing tests...'}
              </span>
              <span className="text-gray-600">
                {completedTests}/{totalTests} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Overall Status */}
        {overallStatus === 'completed' && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">
                Testing Complete: {successCount}/{totalTests} tests passed
              </span>
            </div>
          </div>
        )}

        {overallStatus === 'failed' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-900">
                Testing Complete: {failureCount} test(s) failed, {successCount} passed
              </span>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {testResults.map((test) => (
            <Card key={test.id} className={`p-4 border ${getStatusColor(test.status)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                    
                    {test.status === 'success' && test.duration && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-green-600">
                          ✅ Completed in {test.duration}ms
                        </p>
                        {test.details && (
                          <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                            {test.details}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {test.status === 'error' && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs">
                        <p className="text-red-800 font-medium">Error Details:</p>
                        <p className="text-red-700 mt-1">{test.error}</p>
                        {test.details && (
                          <p className="text-red-600 mt-1 text-xs">{test.details}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-3">
                  <Badge 
                    variant={test.status === 'success' ? 'default' : 
                            test.status === 'error' ? 'destructive' : 'secondary'}
                  >
                    {test.status}
                  </Badge>
                  
                  {!isRunning && test.status !== 'running' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runSingleTest(test.id)}
                      disabled={!ApiKeyService.isKeyAvailable()}
                      className="text-xs"
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Test Coverage:</strong> All major AI components and OpenAI integrations</p>
          <p><strong>API Key:</strong> {ApiKeyService.isKeyAvailable() ? 'Configured and ready' : 'Not available - check API key configuration'}</p>
          <p><strong>Service Status:</strong> {ApiKeyService.getKeyStatus()}</p>
          <div className="flex items-center gap-1 mt-2">
            <Info className="w-3 h-3 text-blue-500" />
            <span className="text-blue-600">Enhanced error handling and fallback responses active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
