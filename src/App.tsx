
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import MessagesHome from '@/pages/MessagesHome';
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background w-full">
          <Router>
            <Routes>
              <Route path="/" element={<MessagesHome />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
