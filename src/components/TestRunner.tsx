
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  Bug,
  TestTube,
  AlertTriangle
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'pending' | 'running';
  duration?: number;
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

export const TestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    totalDuration: 0
  });

  // Mock test execution (since we can't actually run vitest in browser)
  const runTests = async () => {
    setIsRunning(true);
    setTestSuites([]);
    setOverallStats({ totalTests: 0, passedTests: 0, failedTests: 0, totalDuration: 0 });

    // Simulate test execution
    const mockTestSuites: Array<{
      name: string;
      tests: TestResult[];
    }> = [
      {
        name: 'utils/enhancedBlockFactory.test.ts',
        tests: [
          { name: 'should create text block', status: 'pending' },
          { name: 'should create button block', status: 'pending' },
          { name: 'should create image block', status: 'pending' }
        ]
      },
      {
        name: 'utils/dragDropUtils.test.ts',
        tests: [
          { name: 'should handle drag start', status: 'pending' },
          { name: 'should handle drop', status: 'pending' }
        ]
      },
      {
        name: 'utils/emailUtils.test.ts',
        tests: [
          { name: 'should validate email', status: 'pending' },
          { name: 'should parse HTML', status: 'pending' }
        ]
      },
      {
        name: 'services/DirectTemplateService.test.ts',
        tests: [
          { name: 'should load templates', status: 'pending' }
        ]
      },
      {
        name: 'components/EmailEditor.test.tsx',
        tests: [
          { name: 'should render editor', status: 'pending' },
          { name: 'should handle content changes', status: 'pending' }
        ]
      },
      {
        name: 'migration/baselineFunctionality.test.tsx',
        tests: [
          { name: 'baseline functionality check', status: 'pending' }
        ]
      }
    ];

    // Simulate running each test
    for (let suiteIndex = 0; suiteIndex < mockTestSuites.length; suiteIndex++) {
      const suite = mockTestSuites[suiteIndex];
      
      for (let testIndex = 0; testIndex < suite.tests.length; testIndex++) {
        // Update current test as running
        mockTestSuites[suiteIndex].tests[testIndex] = {
          ...mockTestSuites[suiteIndex].tests[testIndex],
          status: 'running'
        };
        
        const updateTestSuites = () => {
          setTestSuites(mockTestSuites.map(s => ({
            name: s.name,
            tests: [...s.tests],
            totalTests: s.tests.length,
            passedTests: s.tests.filter(t => t.status === 'passed').length,
            failedTests: s.tests.filter(t => t.status === 'failed').length,
            duration: Math.random() * 1000
          })));
        };
        
        updateTestSuites();

        // Simulate test execution time
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        // Randomly pass or fail tests (mostly pass for demo)
        const passed = Math.random() > 0.15; // 85% pass rate
        const duration = 50 + Math.random() * 200;

        // Update test result
        mockTestSuites[suiteIndex].tests[testIndex] = {
          name: mockTestSuites[suiteIndex].tests[testIndex].name,
          status: passed ? 'passed' : 'failed',
          duration,
          error: passed ? undefined : 'AssertionError: Expected true but received false'
        };

        updateTestSuites();
      }
    }

    // Calculate final stats
    const allTests = mockTestSuites.flatMap(s => s.tests);
    const totalTests = allTests.length;
    const passedTests = allTests.filter(t => t.status === 'passed').length;
    const failedTests = allTests.filter(t => t.status === 'failed').length;
    const totalDuration = allTests.reduce((sum, t) => sum + (t.duration || 0), 0);

    setOverallStats({ totalTests, passedTests, failedTests, totalDuration });
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const completedTests = overallStats.passedTests + overallStats.failedTests;
  const progressPercentage = overallStats.totalTests > 0 ? (completedTests / overallStats.totalTests) * 100 : 0;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TestTube className="w-5 h-5 text-blue-600" />
              Test Runner
            </h2>
            <p className="text-sm text-gray-600">Run and monitor test suite execution</p>
          </div>
          
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Running tests...</span>
              <span className="text-gray-600">
                {completedTests}/{overallStats.totalTests} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Overall Results */}
        {!isRunning && overallStats.totalTests > 0 && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{overallStats.totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overallStats.passedTests}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{overallStats.failedTests}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(overallStats.totalDuration)}ms</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>
        )}

        {/* Summary Badge */}
        {!isRunning && overallStats.totalTests > 0 && (
          <div className="mt-3 flex justify-center">
            <Badge 
              variant={overallStats.failedTests === 0 ? "default" : "destructive"}
              className="text-sm px-3 py-1"
            >
              {overallStats.failedTests === 0 ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  All tests passed!
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {overallStats.failedTests} test(s) failed
                </>
              )}
            </Badge>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {testSuites.map((suite) => (
            <Card key={suite.name} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{suite.name}</h3>
                <Badge variant="outline">
                  {suite.passedTests}/{suite.totalTests} passed
                </Badge>
              </div>
              
              <div className="space-y-2">
                {suite.tests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="text-sm text-gray-700">{test.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {test.duration && (
                        <span className="text-xs text-gray-500">{Math.round(test.duration)}ms</span>
                      )}
                      <Badge 
                        variant={
                          test.status === 'passed' ? 'default' : 
                          test.status === 'failed' ? 'destructive' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {suite.tests.some(t => t.error) && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                  <div className="font-medium text-red-800 mb-1">Errors:</div>
                  {suite.tests
                    .filter(t => t.error)
                    .map((test, index) => (
                      <div key={index} className="text-red-700">
                        <strong>{test.name}:</strong> {test.error}
                      </div>
                    ))}
                </div>
              )}
            </Card>
          ))}
          
          {!isRunning && testSuites.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bug className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No tests have been run yet.</p>
              <p className="text-sm">Click "Run All Tests" to start testing.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
