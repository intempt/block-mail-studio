
import React, { useState } from 'react';
import { Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Recipient {
  id: string;
  name: string;
  email: string;
}

interface GmailPreviewHeaderProps {
  onRecipientChange?: (recipient: Recipient) => void;
}

const mockRecipients: Recipient[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike.j@startup.io' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@enterprise.com' },
];

export const GmailPreviewHeader: React.FC<GmailPreviewHeaderProps> = ({ 
  onRecipientChange 
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState<string>('1');

  const handleRecipientChange = (recipientId: string) => {
    setSelectedRecipient(recipientId);
    const recipient = mockRecipients.find(r => r.id === recipientId);
    if (recipient && onRecipientChange) {
      onRecipientChange(recipient);
    }
  };

  return (
    <div className="px-6 py-2 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Gmail Desktop Preview
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600">Recipient:</span>
          <Select value={selectedRecipient} onValueChange={handleRecipientChange}>
            <SelectTrigger className="w-48 h-7 text-xs bg-white border-blue-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockRecipients.map((recipient) => (
                <SelectItem key={recipient.id} value={recipient.id} className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium">{recipient.name}</span>
                    <span className="text-gray-500 text-xs">{recipient.email}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
