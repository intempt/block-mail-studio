
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Square,
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  TestTube,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { vitestRunner, TestSuiteResult, TestFile } from '@/services/VitestRunner';

export const RealTestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testFiles, setTestFiles] = useState<TestFile[]>([]);
  const [testResults, setTestResults] = useState<TestSuiteResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [overallStats, setOverallStats] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    totalDuration: 0
  });

  useEffect(() => {
    discoverTests();
    
    vitestRunner.onResults((results) => {
      setTestResults(results);
      updateOverallStats(results);
      setIsRunning(false);
      setCurrentTest(null);
    });

    vitestRunner.onProgress((progressData) => {
      setProgress(progressData);
      if (progressData.currentTest) {
        setCurrentTest(progressData.currentTest);
      }
    });
  }, []);

  const discoverTests = useCallback(async () => {
    try {
      const files = await vitestRunner.discoverTests();
      setTestFiles(files);
    } catch (error) {
      console.error('Failed to discover tests:', error);
    }
  }, []);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentTest(null);
    
    try {
      await vitestRunner.runTests();
    } catch (error) {
      console.error('Test execution failed:', error);
      setIsRunning(false);
    }
  }, []);

  const runSingleTest = useCallback(async (testPath: string) => {
    setIsRunning(true);
    
    try {
      await vitestRunner.runSingleTest(testPath);
    } catch (error) {
      console.error(`Failed to run test ${testPath}:`, error);
      setIsRunning(false);
    }
  }, []);

  const stopTests = useCallback(() => {
    vitestRunner.stopTests();
    setIsRunning(false);
    setCurrentTest(null);
  }, []);

  const updateOverallStats = useCallback((results: TestSuiteResult[]) => {
    const totalTests = results.reduce((sum, suite) => sum + suite.totalTests, 0);
    const passedTests = results.reduce((sum, suite) => sum + suite.passedTests, 0);
    const failedTests = results.reduce((sum, suite) => sum + suite.failedTests, 0);
    const totalDuration = results.reduce((sum, suite) => sum + suite.duration, 0);

    setOverallStats({ totalTests, passedTests, failedTests, totalDuration });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const progressPercentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TestTube className="w-5 h-5 text-blue-600" />
              Real Test Runner
            </h2>
            <p className="text-sm text-gray-600">Execute actual Vitest tests with live results</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={discoverTests} 
              variant="outline" 
              size="sm"
              disabled={isRunning}
            >
              <FileText className="w-4 h-4 mr-2" />
              Discover Tests
            </Button>
            
            {isRunning ? (
              <Button onClick={stopTests} variant="destructive" className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                Stop Tests
              </Button>
            ) : (
              <Button onClick={runAllTests} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Run All Tests
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {currentTest ? `Running: ${currentTest}` : 'Executing tests...'}
              </span>
              <span className="text-gray-600">
                {progress.current}/{progress.total} completed
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
          {/* Test Discovery */}
          {testFiles.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Discovered Test Files ({testFiles.length})</h3>
              <div className="space-y-2">
                {testFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runSingleTest(file.path)}
                      disabled={isRunning}
                      className="text-xs"
                    >
                      Run
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Test Results */}
          {testResults.map((suite, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{suite.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {suite.passedTests}/{suite.totalTests} passed
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(suite.duration)}ms
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                {suite.tests.map((test, testIndex) => (
                  <div key={testIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
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
                    .map((test, errorIndex) => (
                      <div key={errorIndex} className="text-red-700 mb-2">
                        <strong>{test.name}:</strong>
                        <pre className="whitespace-pre-wrap mt-1 text-xs">{test.error}</pre>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          ))}
          
          {!isRunning && testResults.length === 0 && testFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <TestTube className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No tests discovered yet.</p>
              <p className="text-sm">Click "Discover Tests" to scan for test files.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
