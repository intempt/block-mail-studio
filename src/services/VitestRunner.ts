
import { spawn, ChildProcess } from 'child_process';

export interface TestFile {
  path: string;
  name: string;
  tests: TestCase[];
}

export interface TestCase {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
  file: string;
}

export interface TestSuiteResult {
  name: string;
  tests: TestCase[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  coverage?: number;
}

export class VitestRunner {
  private process: ChildProcess | null = null;
  private callbacks: ((results: TestSuiteResult[]) => void)[] = [];
  private progressCallbacks: ((progress: { current: number; total: number; currentTest?: string }) => void)[] = [];

  async discoverTests(): Promise<TestFile[]> {
    return new Promise((resolve, reject) => {
      const process = spawn('npx', ['vitest', 'list', '--reporter=json'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let output = '';
      let errorOutput = '';

      process.stdout?.on('data', (data) => {
        output += data.toString();
      });

      process.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const lines = output.split('\n').filter(line => line.trim());
            const testFiles: TestFile[] = [];
            
            lines.forEach(line => {
              if (line.includes('.test.')) {
                const testFile: TestFile = {
                  path: line.trim(),
                  name: line.split('/').pop() || line,
                  tests: []
                };
                testFiles.push(testFile);
              }
            });
            
            resolve(testFiles);
          } catch (error) {
            reject(new Error(`Failed to parse test discovery: ${error}`));
          }
        } else {
          reject(new Error(`Test discovery failed: ${errorOutput}`));
        }
      });
    });
  }

  async runTests(testPattern?: string): Promise<TestSuiteResult[]> {
    return new Promise((resolve, reject) => {
      const args = ['vitest', 'run', '--reporter=json'];
      if (testPattern) {
        args.push(testPattern);
      }

      this.process = spawn('npx', args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let output = '';
      let errorOutput = '';

      this.process.stdout?.on('data', (data) => {
        output += data.toString();
        this.parseProgressiveOutput(data.toString());
      });

      this.process.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      this.process.on('close', (code) => {
        this.process = null;
        
        if (code === 0 || code === 1) { // 1 means tests ran but some failed
          try {
            const results = this.parseTestResults(output);
            resolve(results);
          } catch (error) {
            reject(new Error(`Failed to parse test results: ${error}`));
          }
        } else {
          reject(new Error(`Test execution failed: ${errorOutput}`));
        }
      });
    });
  }

  async runSingleTest(testPath: string): Promise<TestSuiteResult[]> {
    return this.runTests(testPath);
  }

  stopTests(): void {
    if (this.process) {
      this.process.kill('SIGTERM');
      this.process = null;
    }
  }

  onResults(callback: (results: TestSuiteResult[]) => void): void {
    this.callbacks.push(callback);
  }

  onProgress(callback: (progress: { current: number; total: number; currentTest?: string }) => void): void {
    this.progressCallbacks.push(callback);
  }

  private parseProgressiveOutput(output: string): void {
    // Parse real-time progress from Vitest output
    const lines = output.split('\n');
    
    lines.forEach(line => {
      if (line.includes('✓') || line.includes('✗') || line.includes('⠋')) {
        // Extract test name and progress
        const testMatch = line.match(/\s+([✓✗⠋])\s+(.+)/);
        if (testMatch) {
          const testName = testMatch[2];
          this.progressCallbacks.forEach(cb => {
            cb({ current: 0, total: 0, currentTest: testName });
          });
        }
      }
    });
  }

  private parseTestResults(output: string): TestSuiteResult[] {
    const results: TestSuiteResult[] = [];
    
    try {
      // Try to parse JSON output first
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return this.convertVitestResults(data);
      }
    } catch {
      // Fall back to text parsing
    }

    // Parse text output as fallback
    const lines = output.split('\n');
    let currentSuite: TestSuiteResult | null = null;
    
    lines.forEach(line => {
      // Parse test file headers
      if (line.includes('.test.')) {
        if (currentSuite) {
          results.push(currentSuite);
        }
        
        const fileName = line.match(/([^\/]+\.test\.[jt]sx?)/)?.[1] || 'Unknown';
        currentSuite = {
          name: fileName,
          tests: [],
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          duration: 0
        };
      }
      
      // Parse individual test results
      if (currentSuite && (line.includes('✓') || line.includes('✗'))) {
        const passed = line.includes('✓');
        const testName = line.replace(/[✓✗⠋]\s*/, '').replace(/\(\d+ms\)/, '').trim();
        const durationMatch = line.match(/\((\d+)ms\)/);
        const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
        
        const test: TestCase = {
          name: testName,
          status: passed ? 'passed' : 'failed',
          duration,
          file: currentSuite.name,
          error: passed ? undefined : 'Test failed'
        };
        
        currentSuite.tests.push(test);
        currentSuite.totalTests++;
        if (passed) {
          currentSuite.passedTests++;
        } else {
          currentSuite.failedTests++;
        }
        currentSuite.duration += duration;
      }
    });
    
    if (currentSuite) {
      results.push(currentSuite);
    }
    
    return results;
  }

  private convertVitestResults(data: any): TestSuiteResult[] {
    const results: TestSuiteResult[] = [];
    
    if (data.testResults) {
      data.testResults.forEach((fileResult: any) => {
        const suite: TestSuiteResult = {
          name: fileResult.name || 'Unknown',
          tests: [],
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          duration: fileResult.duration || 0
        };
        
        if (fileResult.assertionResults) {
          fileResult.assertionResults.forEach((test: any) => {
            const testCase: TestCase = {
              name: test.title || test.name,
              status: test.status === 'passed' ? 'passed' : 'failed',
              duration: test.duration,
              file: suite.name,
              error: test.status === 'failed' ? test.failureMessages?.join('\n') : undefined
            };
            
            suite.tests.push(testCase);
            suite.totalTests++;
            if (testCase.status === 'passed') {
              suite.passedTests++;
            } else {
              suite.failedTests++;
            }
          });
        }
        
        results.push(suite);
      });
    }
    
    return results;
  }
}

export const vitestRunner = new VitestRunner();
