import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestResult {
  suiteName: string;
  status: 'pass' | 'fail' | 'running' | 'pending';
  passCount: number;
  failCount: number;
  totalCount: number;
  duration?: number;
  errors?: string[];
}

interface TestSuite {
  name: string;
  type: 'critical' | 'other';
  testCount: number;
  description: string;
}

export const SimplifiedTestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const testSuites: TestSuite[] = [
    // Critical Tests
    { name: 'EmailEditor Critical Tests', type: 'critical', testCount: 8, description: 'Core email editor functionality' },
    { name: 'EmailBlockCanvas Critical Tests', type: 'critical', testCount: 8, description: 'Essential canvas operations' },
    { name: 'Drag and Drop Critical Tests', type: 'critical', testCount: 8, description: 'Core drag and drop functionality' },
    { name: 'User Journey Critical Tests', type: 'critical', testCount: 5, description: 'Complete user workflows' },
    { name: 'Error Handling Critical Tests', type: 'critical', testCount: 7, description: 'Error scenarios and edge cases' },
    { name: 'Performance Critical Tests', type: 'critical', testCount: 6, description: 'Performance requirements' },
    
    // Other Tests
    { name: 'TipTap Editor Tests', type: 'other', testCount: 8, description: 'Rich text editor functionality' },
    { name: 'Gmail Preview Integration', type: 'other', testCount: 6, description: 'Gmail preview functionality' },
    { name: 'Canvas Renderer Tests', type: 'other', testCount: 7, description: 'Canvas rendering and interactions' },
    { name: 'Email Editor State Tests', type: 'other', testCount: 6, description: 'State management and view modes' },
    { name: 'AI Integration Tests', type: 'other', testCount: 5, description: 'AI-powered features' },
    { name: 'Button Component Tests', type: 'other', testCount: 4, description: 'UI button component' },
    { name: 'Layout Config Panel Tests', type: 'other', testCount: 3, description: 'Layout configuration' },
    { name: 'Block Renderer Tests', type: 'other', testCount: 8, description: 'Individual block rendering' },
    { name: 'Template Cycle Tests', type: 'other', testCount: 3, description: 'Template creation and management' },
    { name: 'Drag Drop Workflows', type: 'other', testCount: 4, description: 'End-to-end drag and drop' },
    { name: 'All Block Renderers', type: 'other', testCount: 7, description: 'All block renderer tests' }
  ];

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.testCount, 0);
  const criticalTests = testSuites.filter(s => s.type === 'critical').reduce((sum, suite) => sum + suite.testCount, 0);
  const otherTests = testSuites.filter(s => s.type === 'other').reduce((sum, suite) => sum + suite.testCount, 0);

  const mockRunTests = async (suiteName?: string) => {
    setIsRunning(true);
    
    const suitesToRun = suiteName ? 
      testSuites.filter(suite => suite.name === suiteName) : 
      testSuites;

    for (const suite of suitesToRun) {
      // Add running status
      setResults(prev => {
        const filtered = prev.filter(r => r.suiteName !== suite.name);
        return [...filtered, {
          suiteName: suite.name,
          status: 'running',
          passCount: 0,
          failCount: 0,
          totalCount: suite.testCount
        }];
      });

      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

      // Generate results
      const passCount = Math.floor(Math.random() * suite.testCount * 0.9) + Math.floor(suite.testCount * 0.1);
      const failCount = suite.testCount - passCount;
      const duration = Math.random() * 2000 + 500;
      const errors = failCount > 0 ? Array.from({ length: Math.min(failCount, 3) }, (_, i) => `Test ${i + 1} failed: Assertion error`) : [];

      setResults(prev => {
        const filtered = prev.filter(r => r.suiteName !== suite.name);
        return [...filtered, {
          suiteName: suite.name,
          status: failCount > 0 ? 'fail' : 'pass',
          passCount,
          failCount,
          totalCount: suite.testCount,
          duration,
          errors
        }];
      });
    }

    setIsRunning(false);
  };

  const getOverallStats = () => {
    const totalPassed = results.reduce((sum, r) => sum + r.passCount, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.failCount, 0);
    const totalRan = totalPassed + totalFailed;
    
    return { totalPassed, totalFailed, totalRan };
  };

  const stats = getOverallStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with immediate counts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Test Runner</CardTitle>
                <p className="text-gray-600 mt-1">
                  {totalTests} tests across {testSuites.length} suites • {criticalTests} critical, {otherTests} other
                </p>
              </div>
              <Button
                onClick={() => mockRunTests()}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run All Tests'}
              </Button>
            </div>
            
            {/* Overall stats */}
            {stats.totalRan > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalPassed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.totalFailed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalRan}</div>
                  <div className="text-sm text-gray-600">Total Run</div>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Test Suites List */}
        <div className="space-y-3">
          {/* Critical Tests */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-red-700">Critical Tests ({criticalTests} tests)</h3>
            <div className="space-y-2">
              {testSuites.filter(s => s.type === 'critical').map((suite) => {
                const result = results.find(r => r.suiteName === suite.name);
                return (
                  <Card key={suite.name} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            {result && getStatusIcon(result.status)}
                            <h4 className="font-medium">{suite.name}</h4>
                            <span className="text-sm text-gray-500">({suite.testCount} tests)</span>
                          </div>
                          <p className="text-sm text-gray-600">{suite.description}</p>
                          {result && result.status !== 'running' && (
                            <div className="mt-2 text-sm">
                              <span className="text-green-600">{result.passCount} passed</span>
                              {result.failCount > 0 && <span className="text-red-600 ml-3">{result.failCount} failed</span>}
                              {result.duration && <span className="text-gray-500 ml-3">{result.duration.toFixed(0)}ms</span>}
                            </div>
                          )}
                          {result?.errors && result.errors.length > 0 && (
                            <div className="mt-2 text-xs text-red-600">
                              {result.errors.slice(0, 2).map((error, i) => (
                                <div key={i}>• {error}</div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => mockRunTests(suite.name)}
                          disabled={isRunning}
                        >
                          Run
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Other Tests */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Other Tests ({otherTests} tests)</h3>
            <div className="space-y-2">
              {testSuites.filter(s => s.type === 'other').map((suite) => {
                const result = results.find(r => r.suiteName === suite.name);
                return (
                  <Card key={suite.name} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            {result && getStatusIcon(result.status)}
                            <h4 className="font-medium">{suite.name}</h4>
                            <span className="text-sm text-gray-500">({suite.testCount} tests)</span>
                          </div>
                          <p className="text-sm text-gray-600">{suite.description}</p>
                          {result && result.status !== 'running' && (
                            <div className="mt-2 text-sm">
                              <span className="text-green-600">{result.passCount} passed</span>
                              {result.failCount > 0 && <span className="text-red-600 ml-3">{result.failCount} failed</span>}
                              {result.duration && <span className="text-gray-500 ml-3">{result.duration.toFixed(0)}ms</span>}
                            </div>
                          )}
                          {result?.errors && result.errors.length > 0 && (
                            <div className="mt-2 text-xs text-red-600">
                              {result.errors.slice(0, 2).map((error, i) => (
                                <div key={i}>• {error}</div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => mockRunTests(suite.name)}
                          disabled={isRunning}
                        >
                          Run
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
