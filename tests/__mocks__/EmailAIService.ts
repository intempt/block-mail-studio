
export const EmailAIService = {
  generateEmailContent: vi.fn().mockResolvedValue('Generated email content'),
  optimizeSubjectLine: vi.fn().mockResolvedValue('Optimized subject line'),
  suggestImprovements: vi.fn().mockResolvedValue(['Improvement 1', 'Improvement 2']),
};
