
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UniversalImportService } from '@/services/UniversalImportService';
import { ImportResult } from '@/services/HTMLImportService';

export const ImportTester: React.FC = () => {
  const [testContent, setTestContent] = useState(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
        <mj-button background-color="#F45E43" href="https://example.com">Click me</mj-button>
        <mj-image src="https://via.placeholder.com/400x200" alt="Test image" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `.trim());

  const [result, setResult] = useState<ImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testImport = async () => {
    setIsLoading(true);
    try {
      const importResult = await UniversalImportService.importContent(testContent);
      setResult(importResult);
    } catch (error) {
      setResult({
        blocks: [],
        errors: [`Test failed: ${error.message}`],
        warnings: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>HTML/MJML Import Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Content</label>
            <Textarea
              value={testContent}
              onChange={(e) => setTestContent(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Paste HTML or MJML content here..."
            />
          </div>

          <Button onClick={testImport} disabled={isLoading}>
            {isLoading ? 'Testing Import...' : 'Test Import'}
          </Button>

          {result && (
            <div className="space-y-4">
              {result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h3 className="font-medium text-red-800 mb-2">Errors:</h3>
                  {result.errors.map((error, index) => (
                    <p key={index} className="text-red-700 text-sm">{error}</p>
                  ))}
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Warnings:</h3>
                  {result.warnings.map((warning, index) => (
                    <p key={index} className="text-yellow-700 text-sm">{warning}</p>
                  ))}
                </div>
              )}

              {result.blocks.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h3 className="font-medium text-green-800 mb-2">
                    Successfully imported {result.blocks.length} blocks:
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.blocks.map((block, index) => (
                      <Badge key={index} variant="secondary">
                        {block.type}
                      </Badge>
                    ))}
                  </div>
                  
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium">View block details</summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                      {JSON.stringify(result.blocks, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
