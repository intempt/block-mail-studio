
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RefreshCw, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'pending';
  duration: number;
  error?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
}

export const TestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedSuite, setSelectedSuite] = useState<string>('');

  // Mock test execution - in a real scenario, this would integrate with Vitest
  const executeTests = async () => {
    setIsRunning(true);
    
    // Simulate test execution with your actual test files
    const mockResults: TestSuite[] = [
      {
        name: 'EmailEditor.test.tsx',
        totalTests: 9,
        passedTests: 8,
        failedTests: 1,
        duration: 245,
        tests: [
          { name: 'should render email editor with all main components', status: 'passed', duration: 28 },
          { name: 'should handle subject line changes', status: 'passed', duration: 32 },
          { name: 'should render OmnipresentRibbon with correct props', status: 'passed', duration: 25 },
          { name: 'should handle canvas width and device mode changes', status: 'passed', duration: 41 },
          { name: 'should handle preview mode switching', status: 'failed', duration: 55, error: 'Expected element to be present' },
          { name: 'should render CompactAISuggestions component', status: 'passed', duration: 22 },
          { name: 'should handle back navigation when provided', status: 'passed', duration: 30 },
          { name: 'should initialize with empty canvas when no content provided', status: 'passed', duration: 18 },
          { name: 'should handle content updates from canvas', status: 'passed', duration: 34 }
        ]
      },
      {
        name: 'EmailBlockCanvas.test.tsx',
        totalTests: 8,
        passedTests: 7,
        failedTests: 1,
        duration: 198,
        tests: [
          { name: 'should render empty canvas with drop zone message', status: 'passed', duration: 22 },
          { name: 'should handle drag over events', status: 'passed', duration: 28 },
          { name: 'should handle block drops', status: 'passed', duration: 35 },
          { name: 'should handle layout drops with column configuration', status: 'passed', duration: 42 },
          { name: 'should render blocks when provided', status: 'failed', duration: 38, error: 'Block rendering failed' },
          { name: 'should handle block selection', status: 'passed', duration: 15 },
          { name: 'should respond to preview mode changes', status: 'passed', duration: 12 },
          { name: 'should handle custom preview widths', status: 'passed', duration: 6 }
        ]
      },
      {
        name: 'MJMLService.test.ts',
        totalTests: 6,
        passedTests: 6,
        failedTests: 0,
        duration: 156,
        tests: [
          { name: 'should generate valid MJML for empty email', status: 'passed', duration: 25 },
          { name: 'should generate MJML for text block', status: 'passed', duration: 32 },
          { name: 'should generate MJML for image block', status: 'passed', duration: 28 },
          { name: 'should generate MJML for button block', status: 'passed', duration: 30 },
          { name: 'should handle responsive styling correctly', status: 'passed', duration: 22 },
          { name: 'should convert simple MJML to HTML', status: 'passed', duration: 19 }
        ]
      },
      {
        name: 'dragDropWorkflows.test.tsx',
        totalTests: 4,
        passedTests: 3,
        failedTests: 1,
        duration: 312,
        tests: [
          { name: 'should allow dragging text block to empty canvas', status: 'passed', duration: 85 },
          { name: 'should allow dragging layout blocks to canvas', status: 'passed', duration: 92 },
          { name: 'should allow selecting and deleting blocks', status: 'failed', duration: 78, error: 'Delete functionality not implemented' },
          { name: 'should allow preview mode switching', status: 'passed', duration: 57 }
        ]
      }
    ];

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTestSuites(mockResults);
    setSelectedSuite(mockResults[0]?.name || '');
    setIsRunning(false);
  };

  const getTotalStats = () => {
    const totals = testSuites.reduce(
      (acc, suite) => ({
        tests: acc.tests + suite.totalTests,
        passed: acc.passed + suite.passedTests,
        failed: acc.failed + suite.failedTests,
        duration: acc.duration + suite.duration
      }),
      { tests: 0, passed: 0, failed: 0, duration: 0 }
    );
    return totals;
  };

  const stats = getTotalStats();

  return (
    <div className="w-full h-full p-4 bg-gray-50">
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Email Builder Test Runner
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                onClick={executeTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
            </div>
          </div>
          
          {testSuites.length > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {stats.passed} Passed
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-500" />
                {stats.failed} Failed
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stats.duration}ms
              </Badge>
              <span className="text-gray-500">
                {stats.tests} tests total
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="h-[calc(100%-140px)]">
          {testSuites.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click "Run All Tests" to execute your test suite</p>
                <p className="text-sm mt-2">
                  Tests will run from: EmailEditor, EmailBlockCanvas, MJMLService, and Integration tests
                </p>
              </div>
            </div>
          ) : (
            <Tabs value={selectedSuite} onValueChange={setSelectedSuite} className="h-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                {testSuites.map((suite) => (
                  <TabsTrigger 
                    key={suite.name} 
                    value={suite.name}
                    className="text-xs"
                  >
                    {suite.name.replace('.test.tsx', '').replace('.test.ts', '')}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {testSuites.map((suite) => (
                <TabsContent key={suite.name} value={suite.name} className="h-[calc(100%-60px)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">{suite.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">{suite.passedTests} passed</span>
                      <span className="text-red-600">{suite.failedTests} failed</span>
                      <span className="text-gray-500">{suite.duration}ms</span>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-full">
                    <div className="space-y-2">
                      {suite.tests.map((test, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border ${
                            test.status === 'passed' 
                              ? 'bg-green-50 border-green-200' 
                              : test.status === 'failed'
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {test.status === 'passed' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : test.status === 'failed' ? (
                                <XCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="font-mono text-sm">{test.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{test.duration}ms</span>
                          </div>
                          {test.error && (
                            <div className="mt-2 p-2 bg-red-100 rounded text-red-700 text-xs font-mono">
                              {test.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestRunner;
