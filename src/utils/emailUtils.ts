
import { mjmlService } from '@/services/MJMLService';

export const generateUniqueId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createMJMLTemplate = (content: string, subject?: string): string => {
  return mjmlService.createMJMLTemplate(content, subject);
};

export const compileMJMLToHTML = (mjmlContent: string): string => {
  const result = mjmlService.compileToHTML(mjmlContent);
  
  if (result.errors.length > 0) {
    console.warn('MJML compilation warnings:', result.errors);
  }
  
  return result.html;
};

export const optimizeMJML = (mjmlContent: string): string => {
  return mjmlService.optimizeMJML(mjmlContent);
};

export const validateEmailMJML = (mjmlContent: string): { isValid: boolean; errors: any[] } => {
  return mjmlService.validateMJML(mjmlContent);
};
