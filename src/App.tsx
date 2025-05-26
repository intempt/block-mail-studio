
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Index from '@/pages/Index';
import Messages from '@/pages/Messages';
import WorkspacePage from '@/pages/WorkspacePage';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background w-full">
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/workspace" element={
                  <ErrorBoundary fallback={
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">Workspace Unavailable</h2>
                        <p className="text-gray-600 mb-4">Unable to load the workspace.</p>
                        <button 
                          onClick={() => window.location.href = '/'} 
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Return to Home
                        </button>
                      </div>
                    </div>
                  }>
                    <WorkspacePage />
                  </ErrorBoundary>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
