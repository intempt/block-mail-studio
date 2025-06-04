
import { EmailCompatibilityProcessor } from '@/services/emailCompatibilityProcessor';
import { MockGmailData } from '@/services/mockGmailData';

export interface GmailTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export class RealGmailTester {
  static async testEmailProcessing(emailHtml: string): Promise<GmailTestResult> {
    try {
      const processed = EmailCompatibilityProcessor.processEmailForGmail(emailHtml, {
        stripUnsupportedElements: true,
        inlineStyles: true,
        processImages: true,
        darkModeSupport: true
      });

      if (!processed || processed.length === 0) {
        return {
          success: false,
          message: 'Email processing returned empty result'
        };
      }

      // Check for unsupported elements removal
      const hasScript = processed.includes('<script');
      if (hasScript) {
        return {
          success: false,
          message: 'Script tags were not properly removed'
        };
      }

      return {
        success: true,
        message: 'Email processing completed successfully',
        details: {
          originalLength: emailHtml.length,
          processedLength: processed.length,
          hasInlineStyles: processed.includes('style=')
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Email processing failed: ${error.message}`
      };
    }
  }

  static async testMockDataGeneration(subject: string): Promise<GmailTestResult> {
    try {
      const thread = MockGmailData.generateMockThread(subject);
      const labels = MockGmailData.getGmailLabels();

      if (!thread || !thread.emails || thread.emails.length === 0) {
        return {
          success: false,
          message: 'Mock thread generation failed'
        };
      }

      if (!labels || labels.length === 0) {
        return {
          success: false,
          message: 'Mock labels generation failed'
        };
      }

      const currentEmail = thread.emails[0];
      if (currentEmail.subject !== subject) {
        return {
          success: false,
          message: 'Subject line not properly set in mock thread'
        };
      }

      return {
        success: true,
        message: 'Mock data generation successful',
        details: {
          threadId: thread.id,
          emailCount: thread.emails.length,
          labelCount: labels.length,
          subjectMatch: currentEmail.subject === subject
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Mock data generation failed: ${error.message}`
      };
    }
  }

  static async testPreviewSizeCalculation(): Promise<GmailTestResult> {
    try {
      const desktopSize = EmailCompatibilityProcessor.getGmailPreviewSize('desktop');
      const mobileSize = EmailCompatibilityProcessor.getGmailPreviewSize('mobile');

      if (!desktopSize || !mobileSize) {
        return {
          success: false,
          message: 'Preview size calculation returned null results'
        };
      }

      if (desktopSize.width <= 0 || desktopSize.height <= 0) {
        return {
          success: false,
          message: 'Desktop preview size calculation invalid'
        };
      }

      if (mobileSize.width <= 0 || mobileSize.height <= 0) {
        return {
          success: false,
          message: 'Mobile preview size calculation invalid'
        };
      }

      return {
        success: true,
        message: 'Preview size calculation successful',
        details: {
          desktop: desktopSize,
          mobile: mobileSize
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Preview size calculation failed: ${error.message}`
      };
    }
  }

  static async runAllTests(emailHtml: string, subject: string): Promise<Record<string, GmailTestResult>> {
    console.log('[GMAIL TEST] Starting Gmail preview verification tests');
    
    const results: Record<string, GmailTestResult> = {};

    results.emailProcessing = await this.testEmailProcessing(emailHtml);
    console.log('[GMAIL TEST] Email processing test:', results.emailProcessing);

    results.mockDataGeneration = await this.testMockDataGeneration(subject);
    console.log('[GMAIL TEST] Mock data generation test:', results.mockDataGeneration);

    results.previewSizeCalculation = await this.testPreviewSizeCalculation();
    console.log('[GMAIL TEST] Preview size calculation test:', results.previewSizeCalculation);

    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = Object.keys(results).length;
    
    console.log(`[GMAIL TEST] Completed: ${successCount}/${totalCount} tests passed`);

    return results;
  }
}
