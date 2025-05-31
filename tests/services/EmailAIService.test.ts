
import { vi } from 'vitest';
import { EmailAIService } from '../../src/services/EmailAIService';

// Mock the API key service
vi.mock('../../src/services/apiKeyService', () => ({
  getApiKey: vi.fn(() => 'test-api-key')
}));

// Mock fetch
global.fetch = vi.fn();

describe('EmailAIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates email content from prompt', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'Generated email content' } }]
      })
    };
    
    (fetch as any).mockResolvedValue(mockResponse);
    
    const result = await EmailAIService.generateEmailContent('Create a welcome email');
    expect(result).toBe('Generated email content');
  });

  it('handles API errors gracefully', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    };
    
    (fetch as any).mockResolvedValue(mockResponse);
    
    await expect(EmailAIService.generateEmailContent('test')).rejects.toThrow();
  });

  it('improves existing content', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'Improved content' } }]
      })
    };
    
    (fetch as any).mockResolvedValue(mockResponse);
    
    const result = await EmailAIService.improveContent('Original content', 'Make it more engaging');
    expect(result).toBe('Improved content');
  });

  it('generates subject lines', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'Amazing Subject Line' } }]
      })
    };
    
    (fetch as any).mockResolvedValue(mockResponse);
    
    const result = await EmailAIService.generateSubjectLine('Email content here');
    expect(result).toBe('Amazing Subject Line');
  });

  it('analyzes email performance', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: JSON.stringify({
          score: 85,
          suggestions: ['Improve subject line', 'Add call-to-action']
        }) } }]
      })
    };
    
    (fetch as any).mockResolvedValue(mockResponse);
    
    const result = await EmailAIService.analyzeEmailPerformance('Email HTML here');
    expect(result.score).toBe(85);
    expect(result.suggestions).toHaveLength(2);
  });

  it('handles network errors', async () => {
    (fetch as any).mockRejectedValue(new Error('Network error'));
    
    await expect(EmailAIService.generateEmailContent('test')).rejects.toThrow('Network error');
  });

  it('validates API responses', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ invalid: 'response' })
    };
    
    (fetch as any).mockResolvedValue(mockResponse);
    
    await expect(EmailAIService.generateEmailContent('test')).rejects.toThrow();
  });

  it('handles rate limiting', async () => {
    const mockResponse = {
      ok: false,
      status: 429,
      statusText: 'Too Many Requests'
    };
    
    (fetch as any).mockResolvedValue(mockResponse);
    
    await expect(EmailAIService.generateEmailContent('test')).rejects.toThrow('Too Many Requests');
  });

  it('includes proper headers in requests', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'Response' } }]
      })
    };
    
    (fetch as any).mockResolvedValue(mockResponse);
    
    await EmailAIService.generateEmailContent('test');
    
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        })
      })
    );
  });
});
