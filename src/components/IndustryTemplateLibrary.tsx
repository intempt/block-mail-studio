
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Store, 
  Briefcase, 
  Heart, 
  GraduationCap, 
  Home,
  Car,
  Utensils,
  Plane,
  Search,
  Star,
  TrendingUp
} from 'lucide-react';

interface IndustryTemplate {
  id: string;
  name: string;
  industry: string;
  category: string;
  description: string;
  html: string;
  tags: string[];
  rating: number;
  usageCount: number;
  preview: string;
}

interface IndustryTemplateLibraryProps {
  editor: Editor | null;
}

export const IndustryTemplateLibrary: React.FC<IndustryTemplateLibraryProps> = ({ editor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const industries = [
    { id: 'All', name: 'All Industries', icon: <Store className="w-4 h-4" /> },
    { id: 'E-commerce', name: 'E-commerce', icon: <Store className="w-4 h-4" /> },
    { id: 'SaaS', name: 'SaaS', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'Healthcare', name: 'Healthcare', icon: <Heart className="w-4 h-4" /> },
    { id: 'Education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'Real Estate', name: 'Real Estate', icon: <Home className="w-4 h-4" /> },
    { id: 'Automotive', name: 'Automotive', icon: <Car className="w-4 h-4" /> },
    { id: 'Food & Beverage', name: 'Food & Beverage', icon: <Utensils className="w-4 h-4" /> },
    { id: 'Travel', name: 'Travel', icon: <Plane className="w-4 h-4" /> }
  ];

  const categories = ['All', 'Welcome', 'Promotional', 'Newsletter', 'Abandoned Cart', 'Follow-up', 'Event'];

  const templates: IndustryTemplate[] = [
    {
      id: '1',
      name: 'E-commerce Welcome Series',
      industry: 'E-commerce',
      category: 'Welcome',
      description: 'Welcome new customers with personalized product recommendations',
      html: `<div class="email-container">
        <div class="email-block header-block">
          <h1 style="font-family: Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            Welcome to {{company_name}}!
          </h1>
        </div>
        <div class="email-block paragraph-block">
          <p style="font-family: Arial, sans-serif; color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
            Hi {{first_name}}, thank you for joining our community! We're excited to help you discover amazing products tailored just for you.
          </p>
        </div>
        <div class="email-block button-block" style="text-align: center; padding: 20px;">
          <a href="#" style="display: inline-block; padding: 16px 32px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-family: Arial, sans-serif; font-weight: bold;">
            Start Shopping
          </a>
        </div>
      </div>`,
      tags: ['welcome', 'personalization', 'new customer'],
      rating: 4.8,
      usageCount: 1250,
      preview: 'Welcome new customers with personalized recommendations'
    },
    {
      id: '2',
      name: 'SaaS Onboarding Email',
      industry: 'SaaS',
      category: 'Welcome',
      description: 'Guide new users through your software setup process',
      html: `<div class="email-container">
        <div class="email-block header-block">
          <h1 style="font-family: Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white;">
            Welcome to {{product_name}}
          </h1>
        </div>
        <div class="email-block paragraph-block">
          <p style="font-family: Arial, sans-serif; color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
            Hi {{first_name}}, let's get you set up! Here are the next steps to get the most out of {{product_name}}.
          </p>
        </div>
        <div class="email-block paragraph-block">
          <h3 style="font-family: Arial, sans-serif; color: #1F2937; margin: 0; padding: 0 24px; font-size: 18px;">Quick Setup Guide:</h3>
          <ul style="font-family: Arial, sans-serif; color: #374151; margin: 0; padding: 8px 24px 24px 48px;">
            <li>Complete your profile</li>
            <li>Connect your integrations</li>
            <li>Invite your team</li>
          </ul>
        </div>
      </div>`,
      tags: ['onboarding', 'setup', 'software'],
      rating: 4.7,
      usageCount: 890,
      preview: 'Onboard new SaaS users with step-by-step guidance'
    },
    {
      id: '3',
      name: 'Healthcare Appointment Reminder',
      industry: 'Healthcare',
      category: 'Follow-up',
      description: 'Remind patients about upcoming appointments',
      html: `<div class="email-container">
        <div class="email-block header-block">
          <h1 style="font-family: Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white;">
            Appointment Reminder
          </h1>
        </div>
        <div class="email-block paragraph-block">
          <p style="font-family: Arial, sans-serif; color: #374151; line-height: 1.7; margin: 0; padding: 24px; font-size: 16px;">
            Dear {{first_name}}, this is a friendly reminder about your upcoming appointment with Dr. {{doctor_name}} on {{appointment_date}} at {{appointment_time}}.
          </p>
        </div>
        <div class="email-block paragraph-block">
          <p style="font-family: Arial, sans-serif; color: #374151; line-height: 1.7; margin: 0; padding: 0 24px 24px; font-size: 16px;">
            Please arrive 15 minutes early and bring your insurance card and ID.
          </p>
        </div>
      </div>`,
      tags: ['appointment', 'reminder', 'healthcare'],
      rating: 4.9,
      usageCount: 2100,
      preview: 'Professional appointment reminders for patients'
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = selectedIndustry === 'All' || template.industry === selectedIndustry;
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesIndustry && matchesCategory;
  });

  const loadTemplate = (template: IndustryTemplate) => {
    if (editor) {
      editor.commands.setContent(template.html);
    }
  };

  const getIndustryIcon = (industryId: string) => {
    const industry = industries.find(ind => ind.id === industryId);
    return industry?.icon || <Store className="w-4 h-4" />;
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Industry Templates</h3>
          <Badge variant="secondary" className="ml-auto">
            {filteredTemplates.length} templates
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Industries</div>
            <div className="flex flex-wrap gap-1">
              {industries.slice(0, 4).map((industry) => (
                <Button
                  key={industry.id}
                  variant={selectedIndustry === industry.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedIndustry(industry.id)}
                  className="text-xs flex items-center gap-1"
                >
                  {industry.icon}
                  {industry.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Categories</div>
            <div className="flex flex-wrap gap-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getIndustryIcon(template.industry)}
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{template.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="outline" className="text-xs">
                      {template.industry}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {template.usageCount} uses
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadTemplate(template)}
                  className="flex-1"
                >
                  Use Template
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Preview functionality
                    console.log('Preview template:', template.id);
                  }}
                >
                  Preview
                </Button>
              </div>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-sm">No templates found</p>
              <p className="text-gray-400 text-xs mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
