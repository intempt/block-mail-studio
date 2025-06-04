
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmailEditor from '@/components/EmailEditor';
import { EmailBlockCanvas } from '@/components/EmailBlockCanvas';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Error Handling Critical Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('EmailEditor Error Handling', () => {
    it('CRITICAL: Must handle null/undefined props', () => {
      const problematicProps = {
        content: undefined as any,
        subject: null as any,
        onContentChange: vi.fn(),
        onSubjectChange: vi.fn()
      };
      
      expect(() => {
        render(<EmailEditor {...problematicProps} />, { wrapper: createWrapper() });
      }).not.toThrow();
    });

    it('CRITICAL: Must handle extremely long content', () => {
      const veryLongContent = '<p>' + 'A'.repeat(100000) + '</p>';
      const props = {
        content: veryLongContent,
        subject: 'Test',
        onContentChange: vi.fn(),
        onSubjectChange: vi.fn()
      };
      
      expect(() => {
        render(<EmailEditor {...props} />, { wrapper: createWrapper() });
      }).not.toThrow();
    });

    it('CRITICAL: Must handle special characters in subject', () => {
      const specialSubject = '📧 Special chars: <>&"\'🚀💻';
      const props = {
        content: '<p>Test</p>',
        subject: specialSubject,
        onContentChange: vi.fn(),
        onSubjectChange: vi.fn()
      };
      
      expect(() => {
        render(<EmailEditor {...props} />, { wrapper: createWrapper() });
      }).not.toThrow();
      
      expect(screen.getByDisplayValue(specialSubject)).toBeInTheDocument();
    });

    it('CRITICAL: Must handle malformed HTML gracefully', () => {
      const malformedHTML = '<div><p>Unclosed<span><img src="broken.jpg">';
      const props = {
        content: malformedHTML,
        subject: 'Test',
        onContentChange: vi.fn(),
        onSubjectChange: vi.fn()
      };
      
      expect(() => {
        render(<EmailEditor {...props} />, { wrapper: createWrapper() });
      }).not.toThrow();
    });
  });

  describe('Canvas Error Handling', () => {
    it('CRITICAL: Must handle invalid drop data', () => {
      const mockProps = {
        onContentChange: vi.fn(),
        previewWidth: 600,
        previewMode: 'desktop' as const
      };
      
      render(<EmailBlockCanvas {...mockProps} />);
      
      const canvas = screen.getByTestId('email-canvas');
      
      // Test various invalid drop data
      const invalidData = [
        'not json',
        '{"invalid": "structure"}',
        '{"blockType": "nonexistent"}',
        '',
        null,
        undefined
      ];
      
      invalidData.forEach(data => {
        expect(() => {
          fireEvent.drop(canvas, {
            dataTransfer: {
              getData: vi.fn().mockReturnValue(data)
            }
          });
        }).not.toThrow();
      });
    });

    it('CRITICAL: Must handle extreme preview widths', () => {
      const mockProps = {
        onContentChange: vi.fn(),
        previewWidth: 99999,
        previewMode: 'desktop' as const
      };
      
      expect(() => {
        render(<EmailBlockCanvas {...mockProps} />);
      }).not.toThrow();
      
      // Test negative width
      const negativeProps = { ...mockProps, previewWidth: -100 };
      expect(() => {
        render(<EmailBlockCanvas {...negativeProps} />);
      }).not.toThrow();
    });

    it('CRITICAL: Must handle rapid consecutive operations', () => {
      const mockProps = {
        onContentChange: vi.fn(),
        previewWidth: 600,
        previewMode: 'desktop' as const
      };
      
      render(<EmailBlockCanvas {...mockProps} />);
      
      const canvas = screen.getByTestId('email-canvas');
      
      // Rapid fire events
      for (let i = 0; i < 50; i++) {
        fireEvent.dragOver(canvas);
        fireEvent.dragLeave(canvas);
        fireEvent.click(canvas);
      }
      
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Memory and Performance Error Handling', () => {
    it('CRITICAL: Must handle large number of blocks', () => {
      const mockProps = {
        onContentChange: vi.fn(),
        previewWidth: 600,
        previewMode: 'desktop' as const
      };
      
      render(<EmailBlockCanvas {...mockProps} />);
      
      const canvas = screen.getByTestId('email-canvas');
      
      // Simulate adding many blocks rapidly
      for (let i = 0; i < 100; i++) {
        const dropData = JSON.stringify({ blockType: 'text', id: `block-${i}` });
        fireEvent.drop(canvas, {
          dataTransfer: {
            getData: vi.fn().mockReturnValue(dropData)
          }
        });
      }
      
      expect(canvas).toBeInTheDocument();
    });

    it('CRITICAL: Must handle window resize during operation', () => {
      const props = {
        content: '<p>Test</p>',
        subject: 'Test',
        onContentChange: vi.fn(),
        onSubjectChange: vi.fn()
      };
      
      render(<EmailEditor {...props} />, { wrapper: createWrapper() });
      
      // Simulate window resize
      global.dispatchEvent(new Event('resize'));
      
      expect(screen.getByTestId('email-canvas')).toBeInTheDocument();
    });
  });
});
