
export interface StreamingResponse {
  content: string;
  isComplete: boolean;
  error?: string;
}

export class StreamingChatService {
  private static abortController: AbortController | null = null;

  static async* streamResponse(prompt: string): AsyncGenerator<StreamingResponse> {
    // Abort any existing stream
    if (this.abortController) {
      this.abortController.abort();
    }
    
    this.abortController = new AbortController();
    
    try {
      // Simulate streaming by yielding characters progressively
      // In a real implementation, this would connect to your streaming AI service
      const fullResponse = await this.getFullResponse(prompt);
      
      let currentContent = '';
      const words = fullResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        if (this.abortController.signal.aborted) {
          return;
        }
        
        currentContent += (i > 0 ? ' ' : '') + words[i];
        
        yield {
          content: currentContent,
          isComplete: false
        };
        
        // Add realistic delay between words
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      }
      
      yield {
        content: currentContent,
        isComplete: true
      };
      
    } catch (error) {
      console.error('Streaming error:', error);
      yield {
        content: '',
        isComplete: true,
        error: 'Failed to stream response'
      };
    } finally {
      this.abortController = null;
    }
  }

  private static async getFullResponse(prompt: string): Promise<string> {
    // This would normally call your AI service
    // For now, simulate with a realistic response
    const responses = [
      "I'll help you with that! Let me analyze your requirements and provide a comprehensive solution.",
      "That's a great question. Here's what I recommend based on best practices and current trends.",
      "I understand what you're looking for. Let me break this down into actionable steps for you.",
      "Perfect! I can definitely assist with that. Here's my approach to solving this challenge."
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Thinking delay
    return responses[Math.floor(Math.random() * responses.length)];
  }

  static stopStreaming(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
