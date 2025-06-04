import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Square, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface TestResult {
  suiteName: string;
  testName: string;
  status: 'pass' | 'fail' | 'running' | 'pending';
  duration?: number;
  error?: string;
  category: 'critical' | 'integration' | 'unit' | 'performance';
}

interface TestSuite {
  name: string;
  category: 'critical' | 'integration' | 'unit' | 'performance';
  priority: 'high' | 'medium' | 'low';
  testCount: number;
  description: string;
}

export const UnifiedTestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical' | 'integration' | 'unit' | 'performance'>('all');

  const testSuites: TestSuite[] = [
    // Critical Tests (New)
    {
      name: 'EmailEditor Critical Tests',
      category: 'critical',
      priority: 'high',
      testCount: 8,
      description: 'Core email editor functionality that must work'
    },
    {
      name: 'EmailBlockCanvas Critical Tests',
      category: 'critical',
      priority: 'high',
      testCount: 8,
      description: 'Essential canvas operations and block management'
    },
    {
      name: 'Drag and Drop Critical Tests',
      category: 'critical',
      priority: 'high',
      testCount: 8,
      description: 'Core drag and drop functionality'
    },
    {
      name: 'User Journey Critical Tests',
      category: 'critical',
      priority: 'high',
      testCount: 5,
      description: 'Complete user workflows that must work'
    },
    {
      name: 'Error Handling Critical Tests',
      category: 'critical',
      priority: 'high',
      testCount: 7,
      description: 'Error scenarios and edge cases'
    },
    {
      name: 'Performance Critical Tests',
      category: 'critical',
      priority: 'high',
      testCount: 6,
      description: 'Performance requirements and benchmarks'
    },
    
    // Existing Tests
    {
      name: 'Button Component Tests',
      category: 'unit',
      priority: 'medium',
      testCount: 4,
      description: 'UI button component functionality'
    },
    {
      name: 'Layout Config Panel Tests',
      category: 'unit',
      priority: 'medium',
      testCount: 3,
      description: 'Layout configuration panel'
    },
    {
      name: 'Gmail Preview Integration',
      category: 'integration',
      priority: 'medium',
      testCount: 6,
      description: 'Gmail preview functionality'
    },
    {
      name: 'Email Editor Tests',
      category: 'integration',
      priority: 'high',
      testCount: 10,
      description: 'Main email editor component'
    },
    {
      name: 'Gmail Preview System',
      category: 'integration',
      priority: 'medium',
      testCount: 8,
      description: 'Gmail preview containers and modes'
    },
    {
      name: 'Email Block Canvas Tests',
      category: 'integration',
      priority: 'high',
      testCount: 7,
      description: 'Canvas block management'
    },
    {
      name: 'Drag Drop Workflows',
      category: 'integration',
      priority: 'high',
      testCount: 4,
      description: 'End-to-end drag and drop workflows'
    },
    {
      name: 'Block Renderer Tests',
      category: 'unit',
      priority: 'medium',
      testCount: 8,
      description: 'Individual block rendering'
    },
    {
      name: 'Production AI Features',
      category: 'integration',
      priority: 'medium',
      testCount: 6,
      description: 'AI feature integration tests'
    },
    {
      name: 'All Block Renderers',
      category: 'unit',
      priority: 'medium',
      testCount: 7,
      description: 'Comprehensive block renderer tests'
    },
    {
      name: 'Template Cycle Tests',
      category: 'integration',
      priority: 'high',
      testCount: 3,
      description: 'Template creation and management'
    }
  ];

  const mockRunTests = async (suiteName?: string) => {
    setIsRunning(true);
    setResults([]);

    const suitesToRun = suiteName ? 
      testSuites.filter(suite => suite.name === suiteName) : 
      testSuites;

    for (const suite of suitesToRun) {
      // Simulate running individual tests in the suite
      for (let i = 0; i < suite.testCount; i++) {
        const testName = `Test ${i + 1}`;
        
        // Add running status
        setResults(prev => [...prev, {
          suiteName: suite.name,
          testName,
          status: 'running',
          category: suite.category
        }]);

        // Simulate test execution time
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

        // Simulate test results (mostly pass, some fail for realism)
        const status: 'pass' | 'fail' = Math.random() > 0.15 ? 'pass' : 'fail';
        const duration = Math.random() * 200 + 50;
        const error = status === 'fail' ? `Assertion failed in ${testName}` : undefined;

        setResults(prev => prev.map(result => 
          result.suiteName === suite.name && result.testName === testName
            ? { ...result, status, duration, error }
            : result
        ));
      }
    }

    setIsRunning(false);
  };

  const filteredSuites = testSuites.filter(suite => 
    filter === 'all' || suite.category === filter
  );

  const filteredResults = results.filter(result =>
    filter === 'all' || result.category === filter
  );

  const getStats = () => {
    const total = filteredResults.length;
    const passed = filteredResults.filter(r => r.status === 'pass').length;
    const failed = filteredResults.filter(r => r.status === 'fail').length;
    const running = filteredResults.filter(r => r.status === 'running').length;
    
    return { total, passed, failed, running };
  };

  const stats = getStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'critical': return 'bg-red-500';
      case 'integration': return 'bg-blue-500';
      case 'unit': return 'bg-green-500';
      case 'performance': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Unified Test Runner</h1>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => mockRunTests()}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Stop Tests' : 'Run All Tests'}
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {['all', 'critical', 'integration', 'unit', 'performance'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats */}
          {results.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
                <div className="text-sm text-gray-600">Running</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Suites */}
          <Card>
            <CardHeader>
              <CardTitle>Test Suites ({filteredSuites.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredSuites.map((suite) => (
                  <div
                    key={suite.name}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSuite === suite.name
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSuite(suite.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{suite.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(suite.priority)}>
                          {suite.priority}
                        </Badge>
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(suite.category)}`} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suite.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{suite.testCount} tests</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          mockRunTests(suite.name);
                        }}
                        disabled={isRunning}
                      >
                        Run Suite
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results ({filteredResults.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No test results yet. Run some tests to see results here.
                  </div>
                ) : (
                  filteredResults.map((result, index) => (
                    <div
                      key={`${result.suiteName}-${result.testName}-${index}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <div className="font-medium text-sm">{result.testName}</div>
                          <div className="text-xs text-gray-500">{result.suiteName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {result.duration && (
                          <div className="text-xs text-gray-500">{result.duration.toFixed(0)}ms</div>
                        )}
                        {result.error && (
                          <div className="text-xs text-red-600 max-w-48 truncate" title={result.error}>
                            {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
