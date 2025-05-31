
import * as fs from 'fs';
import * as path from 'path';

export interface TestGenerationResult {
  filePath: string;
  testPath: string;
  testType: 'component' | 'service' | 'utility' | 'integration';
  status: 'generated' | 'updated' | 'skipped' | 'error';
  error?: string;
}

export class AutomatedTestGenerator {
  private testTemplates = {
    component: `import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { {{componentName}} } from '../{{relativePath}}';

describe('{{componentName}}', () => {
  it('should render without crashing', () => {
    render(<{{componentName}} />);
    expect(screen.getByRole('{{defaultRole}}')).toBeInTheDocument();
  });

  it('should handle props correctly', () => {
    const mockProps = {};
    render(<{{componentName}} {...mockProps} />);
    // Add specific prop tests here
  });

  it('should handle user interactions', () => {
    const mockHandler = vi.fn();
    render(<{{componentName}} onClick={mockHandler} />);
    // Add interaction tests here
  });
});`,

    service: `import { vi } from 'vitest';
import { {{serviceName}} } from '../{{relativePath}}';

describe('{{serviceName}}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize correctly', () => {
    expect({{serviceName}}).toBeDefined();
  });

  it('should handle API calls', async () => {
    // Add API test logic here
  });

  it('should handle errors gracefully', async () => {
    // Add error handling tests here
  });
});`,

    utility: `import { {{utilityName}} } from '../{{relativePath}}';

describe('{{utilityName}}', () => {
  it('should return expected output for valid input', () => {
    // Add utility function tests here
  });

  it('should handle edge cases', () => {
    // Add edge case tests here
  });

  it('should validate input parameters', () => {
    // Add input validation tests here
  });
});`
  };

  async scanAndGenerateTests(): Promise<TestGenerationResult[]> {
    const results: TestGenerationResult[] = [];
    const srcPath = path.join(process.cwd(), 'src');
    
    try {
      const files = await this.scanDirectory(srcPath);
      
      for (const file of files) {
        const result = await this.generateTestForFile(file);
        if (result) {
          results.push(result);
        }
      }
    } catch (error) {
      console.error('Error scanning and generating tests:', error);
    }
    
    return results;
  }

  private async scanDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...await this.scanDirectory(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.test.tsx')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private async generateTestForFile(filePath: string): Promise<TestGenerationResult | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileName = path.basename(filePath);
      const relativePath = path.relative(path.join(process.cwd(), 'src'), filePath);
      
      const testType = this.determineTestType(content, fileName);
      const testPath = this.generateTestPath(filePath);
      
      // Check if test already exists
      if (fs.existsSync(testPath)) {
        return {
          filePath,
          testPath,
          testType,
          status: 'skipped'
        };
      }
      
      const testContent = this.generateTestContent(content, fileName, relativePath, testType);
      
      // Ensure test directory exists
      const testDir = path.dirname(testPath);
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      
      fs.writeFileSync(testPath, testContent);
      
      return {
        filePath,
        testPath,
        testType,
        status: 'generated'
      };
    } catch (error) {
      return {
        filePath,
        testPath: '',
        testType: 'utility',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private determineTestType(content: string, fileName: string): 'component' | 'service' | 'utility' | 'integration' {
    if (content.includes('React') && fileName.endsWith('.tsx')) {
      return 'component';
    } else if (content.includes('Service') || content.includes('API') || fileName.toLowerCase().includes('service')) {
      return 'service';
    } else if (fileName.toLowerCase().includes('integration') || content.includes('workflow')) {
      return 'integration';
    } else {
      return 'utility';
    }
  }

  private generateTestPath(filePath: string): string {
    const parsed = path.parse(filePath);
    const srcIndex = filePath.indexOf('src');
    const relativePath = filePath.substring(srcIndex + 4);
    const testPath = path.join(process.cwd(), 'tests', 'auto-generated', relativePath.replace(parsed.ext, `.test${parsed.ext}`));
    return testPath;
  }

  private generateTestContent(content: string, fileName: string, relativePath: string, testType: 'component' | 'service' | 'utility' | 'integration'): string {
    const name = path.parse(fileName).name;
    const template = this.testTemplates[testType] || this.testTemplates.utility;
    
    return template
      .replace(/\{\{componentName\}\}/g, name)
      .replace(/\{\{serviceName\}\}/g, name)
      .replace(/\{\{utilityName\}\}/g, name)
      .replace(/\{\{relativePath\}\}/g, relativePath.replace(/\\/g, '/').replace('.tsx', '').replace('.ts', ''))
      .replace(/\{\{defaultRole\}\}/g, this.guessDefaultRole(content));
  }

  private guessDefaultRole(content: string): string {
    if (content.includes('button')) return 'button';
    if (content.includes('input')) return 'textbox';
    if (content.includes('form')) return 'form';
    if (content.includes('dialog')) return 'dialog';
    return 'generic';
  }

  async removeTestsForDeletedFiles(deletedFiles: string[]): Promise<void> {
    for (const filePath of deletedFiles) {
      const testPath = this.generateTestPath(filePath);
      if (fs.existsSync(testPath)) {
        fs.unlinkSync(testPath);
        console.log(`Removed test file: ${testPath}`);
      }
    }
  }
}

export const automatedTestGenerator = new AutomatedTestGenerator();
