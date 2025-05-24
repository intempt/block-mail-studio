
export const TipTapProService = {
  generateContent: vi.fn().mockResolvedValue('Mocked AI content'),
  optimizeForDeliverability: vi.fn().mockResolvedValue('Optimized content'),
  analyzeEmailPerformance: vi.fn().mockResolvedValue({
    score: 85,
    suggestions: ['Test suggestion']
  }),
};
