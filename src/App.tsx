
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';
import Messages from '@/pages/Messages';
import WorkspacePage from '@/pages/WorkspacePage';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster 
            position="top-right" 
            richColors 
            expand={true}
            closeButton={true}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
