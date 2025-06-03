
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { mockTestSuites, TestSuite, TestResult } from '@/tests/mockTests';

interface TestRunnerState {
  isRunning: boolean;
  currentSuite: string | null;
  currentTest: string | null;
  results: Record<string, TestResult[]>;
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  };
}

export function TestUI() {
  const [state, setState] = useState<TestRunnerState>({
    isRunning: false,
    currentSuite: null,
    currentTest: null,
    results: {},
    summary: { total: 0, passed: 0, failed: 0, duration: 0 }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');

  const runTests = async () => {
    setState(prev => ({ ...prev, isRunning: true, results: {}, summary: { total: 0, passed: 0, failed: 0, duration: 0 } }));
    
    const startTime = Date.now();
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    
    for (const suite of mockTestSuites) {
      setState(prev => ({ ...prev, currentSuite: suite.name, currentTest: null }));
      
      const suiteResults: TestResult[] = [];
      
      for (const test of suite.tests) {
        setState(prev => ({ ...prev, currentTest: test.name }));
        
        // Simulate test execution delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
        
        const result: TestResult = {
          name: test.name,
          status: test.shouldPass ? 'passed' : 'failed',
          duration: Math.random() * 100 + 10,
          error: test.shouldPass ? undefined : test.expectedError
        };
        
        suiteResults.push(result);
        totalTests++;
        
        if (result.status === 'passed') {
          passedTests++;
        } else {
          failedTests++;
        }
        
        setState(prev => ({
          ...prev,
          results: {
            ...prev.results,
            [suite.name]: suiteResults
          }
        }));
      }
    }
    
    const duration = Date.now() - startTime;
    
    setState(prev => ({
      ...prev,
      isRunning: false,
      currentSuite: null,
      currentTest: null,
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        duration
      }
    }));
  };

  const getFilteredSuites = () => {
    return mockTestSuites.filter(suite => {
      const suiteResults = state.results[suite.name] || [];
      const matchesSearch = suite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           suite.tests.some(test => test.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      if (filterStatus === 'all') return true;
      
      return suiteResults.some(result => result.status === filterStatus);
    });
  };

  const getStatusIcon = (status: 'passed' | 'failed') => {
    return status === 'passed' ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (status: 'passed' | 'failed') => {
    return (
      <Badge variant={status === 'passed' ? 'default' : 'destructive'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Email Editor Test Suite</h1>
        <p className="text-gray-600">Comprehensive testing dashboard for the email editor and related components</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold">{state.summary.total}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{state.summary.passed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{state.summary.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold">{state.summary.duration}ms</p>
              </div>
              <RefreshCw className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button 
          onClick={runTests} 
          disabled={state.isRunning}
          className="flex items-center gap-2"
        >
          {state.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {state.isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
        
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'passed' | 'failed')}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Tests</option>
            <option value="passed">Passed Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Running Status */}
      {state.isRunning && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>
                Running: {state.currentSuite} {state.currentTest && `- ${state.currentTest}`}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4">
            {getFilteredSuites().map((suite) => {
              const suiteResults = state.results[suite.name] || [];
              const passed = suiteResults.filter(r => r.status === 'passed').length;
              const failed = suiteResults.filter(r => r.status === 'failed').length;
              const total = suiteResults.length;
              
              return (
                <Card key={suite.name}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{suite.name}</CardTitle>
                      {total > 0 && (
                        <div className="flex gap-2">
                          <Badge variant="outline">{passed}/{total} passed</Badge>
                          {failed > 0 && <Badge variant="destructive">{failed} failed</Badge>}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{suite.description}</p>
                  </CardHeader>
                  {total > 0 && (
                    <CardContent>
                      <div className="grid gap-2">
                        {suiteResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(result.status)}
                              <span className="text-sm">{result.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{result.duration.toFixed(1)}ms</span>
                              {getStatusBadge(result.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="detailed" className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {getFilteredSuites().map((suite) => {
                const suiteResults = state.results[suite.name] || [];
                
                return (
                  <Card key={suite.name}>
                    <CardHeader>
                      <CardTitle>{suite.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {suiteResults.map((result, index) => (
                          <div key={index} className="border-l-4 border-gray-200 pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(result.status)}
                                <span className="font-medium">{result.name}</span>
                              </div>
                              <span className="text-sm text-gray-500">{result.duration.toFixed(1)}ms</span>
                            </div>
                            {result.error && (
                              <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                                <p className="text-sm text-red-700 font-medium">Error:</p>
                                <p className="text-sm text-red-600 mt-1">{result.error}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
