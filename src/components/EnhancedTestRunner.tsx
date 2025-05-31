
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause,
  RefreshCw,
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Brain,
  Eye,
  Settings,
  FileText,
  Trash2,
  Plus,
  Activity,
  Target,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { automatedTestGenerator, TestGenerationResult } from '@/services/AutomatedTestGenerator';
import { fileSystemWatcher, FileChange } from '@/services/FileSystemWatcher';

interface TestSuite {
  name: string;
  category: 'component' | 'service' | 'utility' | 'integration' | 'ai' | 'performance';
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  coverage: number;
  duration: number;
}

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
  coverage?: number;
}

export const EnhancedTestRunner: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [autoGenResults, setAutoGenResults] = useState<TestGenerationResult[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    coverage: 0,
    duration: 0
  });
  const [recentChanges, setRecentChanges] = useState<FileChange[]>([]);

  // Initialize test discovery and file watching
  useEffect(() => {
    discoverTests();
    startFileWatching();
    
    return () => {
      fileSystemWatcher.stopWatching();
    };
  }, []);

  const discoverTests = useCallback(async () => {
    // Mock test discovery - in real implementation, this would scan test files
    const mockSuites: TestSuite[] = [
      {
        name: 'Component Tests',
        category: 'component',
        tests: [
          { id: 'comp-1', name: 'EmailEditor renders correctly', status: 'pending' },
          { id: 'comp-2', name: 'Button handles clicks', status: 'pending' },
          { id: 'comp-3', name: 'Form validation works', status: 'pending' }
        ],
        status: 'pending',
        coverage: 0,
        duration: 0
      },
      {
        name: 'Service Tests',
        category: 'service',
        tests: [
          { id: 'serv-1', name: 'OpenAI API integration', status: 'pending' },
          { id: 'serv-2', name: 'Email service functionality', status: 'pending' }
        ],
        status: 'pending',
        coverage: 0,
        duration: 0
      },
      {
        name: 'Utility Tests',
        category: 'utility',
        tests: [
          { id: 'util-1', name: 'Block factory functions', status: 'pending' },
          { id: 'util-2', name: 'Email utils validation', status: 'pending' }
        ],
        status: 'pending',
        coverage: 0,
        duration: 0
      }
    ];
    
    setTestSuites(mockSuites);
    updateOverallStats(mockSuites);
  }, []);

  const startFileWatching = useCallback(() => {
    if (!isWatching) {
      fileSystemWatcher.startWatching();
      fileSystemWatcher.onFileChange(handleFileChanges);
      setIsWatching(true);
    }
  }, [isWatching]);

  const handleFileChanges = useCallback(async (changes: FileChange[]) => {
    setRecentChanges(prev => [...changes, ...prev].slice(0, 10));
    
    // Auto-generate tests for new files
    const newFiles = changes.filter(c => c.type === 'added');
    if (newFiles.length > 0) {
      const results = await automatedTestGenerator.scanAndGenerateTests();
      setAutoGenResults(prev => [...results, ...prev].slice(0, 50));
    }
    
    // Remove tests for deleted files
    const deletedFiles = changes.filter(c => c.type === 'deleted').map(c => c.filePath);
    if (deletedFiles.length > 0) {
      await automatedTestGenerator.removeTestsForDeletedFiles(deletedFiles);
    }
    
    // Re-discover tests
    await discoverTests();
  }, [discoverTests]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    
    for (let suiteIndex = 0; suiteIndex < testSuites.length; suiteIndex++) {
      const suite = testSuites[suiteIndex];
      
      // Update suite status to running
      setTestSuites(prev => prev.map((s, i) => 
        i === suiteIndex ? { ...s, status: 'running' } : s
      ));
      
      for (let testIndex = 0; testIndex < suite.tests.length; testIndex++) {
        // Update test status to running
        setTestSuites(prev => prev.map((s, i) => 
          i === suiteIndex ? {
            ...s,
            tests: s.tests.map((t, j) => 
              j === testIndex ? { ...t, status: 'running' } : t
            )
          } : s
        ));
        
        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        
        // Update test result
        const passed = Math.random() > 0.15; // 85% pass rate
        const duration = 50 + Math.random() * 200;
        
        setTestSuites(prev => prev.map((s, i) => 
          i === suiteIndex ? {
            ...s,
            tests: s.tests.map((t, j) => 
              j === testIndex ? { 
                ...t, 
                status: passed ? 'passed' : 'failed',
                duration,
                error: passed ? undefined : 'Test assertion failed'
              } : t
            )
          } : s
        ));
      }
      
      // Update suite status
      const passedCount = suite.tests.filter(t => t.status === 'passed').length;
      const failedCount = suite.tests.filter(t => t.status === 'failed').length;
      const suitePassed = failedCount === 0;
      
      setTestSuites(prev => prev.map((s, i) => 
        i === suiteIndex ? { 
          ...s, 
          status: suitePassed ? 'completed' : 'failed',
          coverage: Math.random() * 40 + 60, // 60-100% coverage
          duration: suite.tests.reduce((sum, t) => sum + (t.duration || 0), 0)
        } : s
      ));
    }
    
    setIsRunning(false);
    
    // Update overall stats
    updateOverallStats(testSuites);
  }, [testSuites]);

  const updateOverallStats = useCallback((suites: TestSuite[]) => {
    const allTests = suites.flatMap(s => s.tests);
    const totalTests = allTests.length;
    const passedTests = allTests.filter(t => t.status === 'passed').length;
    const failedTests = allTests.filter(t => t.status === 'failed').length;
    const coverage = suites.reduce((sum, s) => sum + s.coverage, 0) / suites.length || 0;
    const duration = suites.reduce((sum, s) => sum + s.duration, 0);
    
    setOverallStats({ totalTests, passedTests, failedTests, coverage, duration });
  }, []);

  const generateTestsForProject = useCallback(async () => {
    const results = await automatedTestGenerator.scanAndGenerateTests();
    setAutoGenResults(prev => [...results, ...prev].slice(0, 50));
    await discoverTests();
  }, [discoverTests]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'passed': case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'component': return <Eye className="w-4 h-4" />;
      case 'service': return <Settings className="w-4 h-4" />;
      case 'utility': return <FileText className="w-4 h-4" />;
      case 'integration': return <Activity className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-600" />
              Automated Test Suite Dashboard
            </h1>
            <p className="text-gray-600">Side-by-side development with automatic test generation</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={isWatching ? 'default' : 'secondary'} className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {isWatching ? 'Watching Files' : 'Not Watching'}
            </Badge>
            
            <Button onClick={generateTestsForProject} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Generate Tests
            </Button>
            
            <Button onClick={runAllTests} disabled={isRunning} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run All Tests'}
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{overallStats.totalTests}</div>
              <div className="text-xs text-gray-600">Total Tests</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overallStats.passedTests}</div>
              <div className="text-xs text-gray-600">Passed</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{overallStats.failedTests}</div>
              <div className="text-xs text-gray-600">Failed</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(overallStats.coverage)}%</div>
              <div className="text-xs text-gray-600">Coverage</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{Math.round(overallStats.duration)}ms</div>
              <div className="text-xs text-gray-600">Duration</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="suites" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-4">
            <TabsTrigger value="suites">Test Suites</TabsTrigger>
            <TabsTrigger value="auto-gen">Auto Generation</TabsTrigger>
            <TabsTrigger value="file-changes">File Changes</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suites" className="flex-1 mx-4 mb-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {testSuites.map((suite, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(suite.category)}
                        <h3 className="font-semibold text-gray-900">{suite.name}</h3>
                        {getStatusIcon(suite.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{suite.tests.length} tests</Badge>
                        <Badge variant="outline">{Math.round(suite.coverage)}% coverage</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {suite.tests.map((test, testIndex) => (
                        <div key={testIndex} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.status)}
                            <span className="text-sm text-gray-700">{test.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {test.duration && (
                              <span className="text-xs text-gray-500">{Math.round(test.duration)}ms</span>
                            )}
                            <Badge variant={test.status === 'passed' ? 'default' : test.status === 'failed' ? 'destructive' : 'secondary'} className="text-xs">
                              {test.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="auto-gen" className="flex-1 mx-4 mb-4">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {autoGenResults.map((result, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{result.filePath}</div>
                        <div className="text-xs text-gray-600">{result.testPath}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={result.status === 'generated' ? 'default' : 'secondary'}>
                          {result.testType}
                        </Badge>
                        <Badge variant={result.status === 'generated' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                    {result.error && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                        {result.error}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="file-changes" className="flex-1 mx-4 mb-4">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {recentChanges.map((change, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {change.type === 'added' && <Plus className="w-4 h-4 text-green-500" />}
                        {change.type === 'modified' && <RefreshCw className="w-4 h-4 text-blue-500" />}
                        {change.type === 'deleted' && <Trash2 className="w-4 h-4 text-red-500" />}
                        <span className="text-sm font-medium">{change.filePath}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(change.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="coverage" className="flex-1 mx-4 mb-4">
            <Card className="h-full p-4">
              <h3 className="font-semibold mb-4">Coverage Heatmap</h3>
              <div className="space-y-4">
                {testSuites.map((suite, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{suite.name}</span>
                      <span className="text-sm text-gray-600">{Math.round(suite.coverage)}%</span>
                    </div>
                    <Progress value={suite.coverage} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
