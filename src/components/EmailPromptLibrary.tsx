
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, 
  ShoppingCart, 
  Calendar, 
  Megaphone, 
  Heart, 
  Gift,
  Users,
  Briefcase,
  Sparkles,
  Trophy
} from 'lucide-react';

export interface EmailPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tone: 'professional' | 'casual' | 'friendly' | 'urgent';
  type: 'welcome' | 'promotional' | 'newsletter' | 'announcement';
  icon: React.ReactNode;
  tags: string[];
}

const emailPrompts: EmailPrompt[] = [
  {
    id: 'welcome-saas',
    title: 'SaaS Welcome Email',
    description: 'Professional welcome email for new SaaS subscribers',
    prompt: 'Create a welcome email for new subscribers to a SaaS platform. Include onboarding steps, key features, and a getting started guide.',
    category: 'SaaS',
    tone: 'professional',
    type: 'welcome',
    icon: <Briefcase className="w-4 h-4" />,
    tags: ['onboarding', 'SaaS', 'welcome']
  },
  {
    id: 'promo-flash-sale',
    title: 'Flash Sale Promotion',
    description: 'Urgent promotional email for limited-time offers',
    prompt: 'Create a flash sale promotional email with urgency and excitement. Include countdown timer mention, discount percentage, and strong call-to-action.',
    category: 'E-commerce',
    tone: 'urgent',
    type: 'promotional',
    icon: <ShoppingCart className="w-4 h-4" />,
    tags: ['flash sale', 'discount', 'urgent']
  },
  {
    id: 'newsletter-weekly',
    title: 'Weekly Newsletter',
    description: 'Regular newsletter with updates and insights',
    prompt: 'Create a weekly newsletter with company updates, industry insights, featured content, and upcoming events.',
    category: 'Content',
    tone: 'friendly',
    type: 'newsletter',
    icon: <Calendar className="w-4 h-4" />,
    tags: ['newsletter', 'updates', 'weekly']
  },
  {
    id: 'product-launch',
    title: 'Product Launch',
    description: 'Exciting announcement for new product releases',
    prompt: 'Create a product launch announcement email with features, benefits, early access offer, and social proof.',
    category: 'Product',
    tone: 'professional',
    type: 'announcement',
    icon: <Sparkles className="w-4 h-4" />,
    tags: ['product launch', 'announcement', 'features']
  },
  {
    id: 'holiday-campaign',
    title: 'Holiday Campaign',
    description: 'Seasonal holiday email with festive tone',
    prompt: 'Create a holiday campaign email with seasonal greetings, special offers, gift guides, and holiday imagery.',
    category: 'Seasonal',
    tone: 'friendly',
    type: 'promotional',
    icon: <Gift className="w-4 h-4" />,
    tags: ['holiday', 'seasonal', 'gifts']
  },
  {
    id: 'fitness-motivation',
    title: 'Fitness Motivation',
    description: 'Motivational email for fitness app users',
    prompt: 'Create a motivational email for fitness app users with workout tips, progress tracking, and encouragement to stay active.',
    category: 'Fitness',
    tone: 'friendly',
    type: 'newsletter',
    icon: <Trophy className="w-4 h-4" />,
    tags: ['fitness', 'motivation', 'health']
  },
  {
    id: 'customer-appreciation',
    title: 'Customer Appreciation',
    description: 'Thank you email for loyal customers',
    prompt: 'Create a customer appreciation email thanking loyal customers with exclusive benefits, personal touch, and future previews.',
    category: 'Relationship',
    tone: 'friendly',
    type: 'announcement',
    icon: <Heart className="w-4 h-4" />,
    tags: ['appreciation', 'loyalty', 'thank you']
  },
  {
    id: 'webinar-invitation',
    title: 'Webinar Invitation',
    description: 'Professional webinar invitation email',
    prompt: 'Create a webinar invitation email with event details, speaker information, key takeaways, and registration CTA.',
    category: 'Events',
    tone: 'professional',
    type: 'announcement',
    icon: <Users className="w-4 h-4" />,
    tags: ['webinar', 'invitation', 'education']
  }
];

interface EmailPromptLibraryProps {
  onSelectPrompt: (prompt: EmailPrompt) => void;
  selectedCategory?: string;
}

export const EmailPromptLibrary: React.FC<EmailPromptLibraryProps> = ({ 
  onSelectPrompt,
  selectedCategory = 'All'
}) => {
  const categories = ['All', ...Array.from(new Set(emailPrompts.map(p => p.category)))];
  const [activeCategory, setActiveCategory] = React.useState(selectedCategory);

  const filteredPrompts = activeCategory === 'All' 
    ? emailPrompts 
    : emailPrompts.filter(p => p.category === activeCategory);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Prompts</h3>
        
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredPrompts.map((prompt) => (
            <Card 
              key={prompt.id} 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSelectPrompt(prompt)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                  {prompt.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {prompt.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {prompt.description}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {prompt.tone}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {prompt.type}
                    </Badge>
                    {prompt.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
