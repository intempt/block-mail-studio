
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Sparkles, 
  ChevronDown,
  Send,
  Zap,
  FileText,
  Palette,
  Image,
  Type,
  Target,
  BarChart3
} from 'lucide-react';
import { SmartDropdown } from './SmartDropdown';
import { AgenticAIEngine } from './AgenticAIEngine';
import { EmailTemplate } from './TemplateManager';
import { EmailPrompt } from './EmailPromptLibrary';

interface AgenticHomepageProps {
  templates?: EmailTemplate[];
  onEnterEditor: (emailHTML?: string, subjectLine?: string) => void;
}

export const AgenticHomepage: React.FC<AgenticHomepageProps> = ({
  templates = [],
  onEnterEditor
}) => {
  const [taskInput, setTaskInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [mode, setMode] = useState<'ask' | 'mail'>('ask');

  const quickActions = [
    {
      id: 'brand-kit',
      icon: <Palette className="w-4 h-4" />,
      label: 'Brand Kit',
      description: 'Apply your brand colors and fonts to emails'
    },
    {
      id: 'ai-images',
      icon: <Image className="w-4 h-4" />,
      label: 'AI Images',
      description: 'Generate professional images for campaigns'
    },
    {
      id: 'smart-copy',
      icon: <Type className="w-4 h-4" />,
      label: 'Smart Copy',
      description: 'Write compelling email copy that converts'
    },
    {
      id: 'optimize',
      icon: <Target className="w-4 h-4" />,
      label: 'Optimize',
      description: 'Analyze and improve email performance'
    },
    {
      id: 'ab-testing',
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'A/B Testing',
      description: 'Create multiple variations for split testing'
    }
  ];

  const samplePrompts = [
    'Create a welcome email series for new subscribers',
    'Generate a product announcement with compelling copy',
    'Build a newsletter template with modern design',
    'Design a promotional email for Black Friday sale',
    'Create an abandoned cart recovery email sequence',
    'Make a thank you email after purchase confirmation'
  ];

  const handleSubmit = () => {
    if (!taskInput.trim()) return;
    setShowChat(true);
  };

  const handlePromptSelect = (prompt: string) => {
    setTaskInput(prompt);
    setShowDropdown(false);
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    onEnterEditor(template.html, template.subject);
  };

  const handleActionSelect = (action: any) => {
    setTaskInput(`Help me with ${action.description.toLowerCase()}`);
    setShowDropdown(false);
  };

  const handleChatComplete = (emailHTML?: string, subjectLine?: string) => {
    if (emailHTML) {
      onEnterEditor(emailHTML, subjectLine);
    }
  };

  if (showChat) {
    return (
      <AgenticAIEngine
        initialPrompt={taskInput}
        mode={mode}
        templates={templates}
        onComplete={handleChatComplete}
        onBack={() => setShowChat(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            What are we going to code next?
          </h1>
          <p className="text-lg text-gray-600">
            Describe your email task and let AI help you build it
          </p>
        </div>

        {/* Main Input Area */}
        <Card className="p-8 border border-gray-200 shadow-lg bg-white">
          <div className="space-y-6">
            {/* Input Section */}
            <div className="relative">
              <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                <Input
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Describe your task..."
                  className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>

              {/* Smart Dropdown */}
              {showDropdown && (
                <SmartDropdown
                  quickActions={quickActions}
                  templates={templates}
                  samplePrompts={samplePrompts}
                  onPromptSelect={handlePromptSelect}
                  onTemplateSelect={handleTemplateSelect}
                  onActionSelect={handleActionSelect}
                  onClose={() => setShowDropdown(false)}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setMode('ask');
                  handleSubmit();
                }}
                disabled={!taskInput.trim()}
                className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Ask
              </Button>
              <Button
                onClick={() => {
                  setMode('mail');
                  handleSubmit();
                }}
                disabled={!taskInput.trim()}
                variant="outline"
                className="px-8 py-3 text-lg border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Send className="w-5 h-5 mr-2" />
                Mail
              </Button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3 text-center">Or try one of these:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {samplePrompts.slice(0, 3).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePromptSelect(prompt)}
                    className="text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-300"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    {prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            AI-powered email builder • Start with conversation, refine with visual tools
          </p>
        </div>
      </div>
    </div>
  );
};
