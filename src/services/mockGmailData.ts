
export interface MockContact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isVerified: boolean;
}

export interface MockEmail {
  id: string;
  subject: string;
  sender: MockContact;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  labels: string[];
}

export interface MockGmailThread {
  id: string;
  emails: MockEmail[];
  lastActivity: Date;
}

export class MockGmailData {
  private static readonly MOCK_CONTACTS: MockContact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'SJ',
      isVerified: true
    },
    {
      id: '2',
      name: 'Marketing Team',
      email: 'marketing@company.com',
      avatar: 'MT',
      isVerified: true
    },
    {
      id: '3',
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      avatar: 'JS',
      isVerified: false
    },
    {
      id: '4',
      name: 'Newsletter',
      email: 'news@updates.com',
      avatar: 'NL',
      isVerified: true
    }
  ];

  static generateMockThread(currentSubject: string): MockGmailThread {
    const mockEmails: MockEmail[] = [
      {
        id: 'current',
        subject: currentSubject,
        sender: this.MOCK_CONTACTS[0],
        timestamp: new Date(),
        isRead: false,
        isStarred: false,
        hasAttachment: false,
        labels: ['inbox', 'important']
      }
    ];

    // Add some context emails
    for (let i = 1; i <= 3; i++) {
      mockEmails.push({
        id: `context-${i}`,
        subject: this.generateContextSubject(i),
        sender: this.MOCK_CONTACTS[i],
        timestamp: new Date(Date.now() - i * 3600000), // Hours ago
        isRead: Math.random() > 0.3,
        isStarred: Math.random() > 0.8,
        hasAttachment: Math.random() > 0.7,
        labels: this.generateRandomLabels()
      });
    }

    return {
      id: 'thread-1',
      emails: mockEmails,
      lastActivity: new Date()
    };
  }

  private static generateContextSubject(index: number): string {
    const subjects = [
      'Weekly Team Update - Important Action Items',
      'Q4 Marketing Campaign Results',
      'New Product Launch - Beta Testing',
      'Monthly Newsletter - Industry Insights'
    ];
    return subjects[index - 1] || `Email ${index}`;
  }

  private static generateRandomLabels(): string[] {
    const allLabels = ['inbox', 'important', 'work', 'personal', 'updates', 'social'];
    const count = Math.floor(Math.random() * 3) + 1;
    return allLabels.slice(0, count);
  }

  static getGmailLabels() {
    return [
      { id: 'inbox', name: 'Inbox', count: 1247, icon: 'inbox' },
      { id: 'starred', name: 'Starred', count: 23, icon: 'star' },
      { id: 'important', name: 'Important', count: 8, icon: 'bookmark' },
      { id: 'sent', name: 'Sent', count: 456, icon: 'send' },
      { id: 'drafts', name: 'Drafts', count: 12, icon: 'file-text' },
      { id: 'all', name: 'All Mail', count: 2847, icon: 'mail' },
      { id: 'spam', name: 'Spam', count: 3, icon: 'shield' },
      { id: 'trash', name: 'Trash', count: 0, icon: 'trash' }
    ];
  }

  static getGmailSettings() {
    return {
      theme: 'default',
      density: 'default',
      previewPane: 'right',
      conversationView: true,
      importanceMarkers: true,
      readingPaneLocation: 'right'
    };
  }
}
