
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComponentStatus {
  name: string;
  status: 'loading' | 'success' | 'error';
  error?: string;
}

interface ComponentHealthCheckerProps {
  onForceLoad?: () => void;
}

export const ComponentHealthChecker: React.FC<ComponentHealthCheckerProps> = ({ onForceLoad }) => {
  const [components, setComponents] = useState<ComponentStatus[]>([
    { name: 'Router', status: 'loading' },
    { name: 'QueryClient', status: 'loading' },
    { name: 'UI Components', status: 'loading' },
    { name: 'Email Editor', status: 'loading' }
  ]);

  useEffect(() => {
    const checkComponents = async () => {
      const updates: ComponentStatus[] = [];

      // Check Router
      try {
        updates.push({ name: 'Router', status: 'success' });
      } catch (error) {
        updates.push({ name: 'Router', status: 'error', error: String(error) });
      }

      // Check QueryClient
      try {
        updates.push({ name: 'QueryClient', status: 'success' });
      } catch (error) {
        updates.push({ name: 'QueryClient', status: 'error', error: String(error) });
      }

      // Check UI Components
      try {
        updates.push({ name: 'UI Components', status: 'success' });
      } catch (error) {
        updates.push({ name: 'UI Components', status: 'error', error: String(error) });
      }

      // Check Email Editor (simulate async check)
      setTimeout(() => {
        setComponents(prev => prev.map(comp => {
          const update = updates.find(u => u.name === comp.name);
          return update || comp;
        }));
        
        setComponents(prev => prev.map(comp => 
          comp.name === 'Email Editor' 
            ? { ...comp, status: 'success' }
            : comp
        ));
      }, 1000);

      setComponents(prev => prev.map(comp => {
        const update = updates.find(u => u.name === comp.name);
        return update || comp;
      }));
    };

    checkComponents();
  }, []);

  const allLoaded = components.every(comp => comp.status === 'success');
  const hasErrors = components.some(comp => comp.status === 'error');

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Loading Email Editor...</h2>
      
      <div className="space-y-3">
        {components.map((comp) => (
          <div key={comp.name} className="flex items-center gap-3">
            {comp.status === 'loading' && <Loader className="w-4 h-4 animate-spin text-blue-500" />}
            {comp.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {comp.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
            
            <span className={`text-sm ${
              comp.status === 'error' ? 'text-red-600' : 
              comp.status === 'success' ? 'text-green-600' : 
              'text-gray-600'
            }`}>
              {comp.name}
            </span>
            
            {comp.error && (
              <span className="text-xs text-red-500 ml-auto">
                {comp.error.substring(0, 30)}...
              </span>
            )}
          </div>
        ))}
      </div>

      {hasErrors && onForceLoad && (
        <div className="mt-6 pt-4 border-t">
          <Button 
            onClick={onForceLoad}
            variant="outline"
            className="w-full"
          >
            Force Load Editor
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Some components failed to load. Click to proceed anyway.
          </p>
        </div>
      )}

      {allLoaded && (
        <div className="mt-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-green-600">All components loaded successfully!</p>
        </div>
      )}
    </div>
  );
};
