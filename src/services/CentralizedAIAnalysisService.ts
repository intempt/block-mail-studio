
export interface UnifiedAISuggestion {
  id: string;
  title: string;
  type: 'subject' | 'copy' | 'tone' | 'cta' | 'design' | 'performance' | 'optimization';
  current: string;
  suggested: string;
  blockId?: string;
  styleChanges?: any;
}

export class CentralizedAIAnalysisService {
  static generateSuggestions(emailHTML: string, subjectLine: string): UnifiedAISuggestion[] {
    return [];
  }
}
