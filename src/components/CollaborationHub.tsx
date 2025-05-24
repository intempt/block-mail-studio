
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Shield, 
  UserPlus,
  Settings,
  Bell,
  Eye,
  Edit,
  Send,
  MoreHorizontal
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: Date;
  resolved: boolean;
  replies: Comment[];
}

interface ApprovalWorkflow {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: TeamMember;
  requester: TeamMember;
  timestamp: Date;
  comments?: string;
}

interface CollaborationHubProps {
  projectId: string;
}

export const CollaborationHub: React.FC<CollaborationHubProps> = ({ 
  projectId 
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'comments' | 'approvals'>('team');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [approvals, setApprovals] = useState<ApprovalWorkflow[]>([]);
  const [newComment, setNewComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    loadCollaborationData();
  }, [projectId]);

  const loadCollaborationData = () => {
    // Mock data
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah@company.com',
        role: 'owner',
        isOnline: true,
        lastSeen: new Date()
      },
      {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike@company.com',
        role: 'editor',
        isOnline: true,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Lisa Wang',
        email: 'lisa@company.com',
        role: 'viewer',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    const mockComments: Comment[] = [
      {
        id: '1',
        author: mockTeamMembers[1],
        content: 'The header image looks great! Should we A/B test this version?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        resolved: false,
        replies: [
          {
            id: '1-1',
            author: mockTeamMembers[0],
            content: 'Great idea! I\'ll set up the A/B test parameters.',
            timestamp: new Date(Date.now() - 20 * 60 * 1000),
            resolved: false,
            replies: []
          }
        ]
      },
      {
        id: '2',
        author: mockTeamMembers[2],
        content: 'The mobile layout needs some adjustment on the CTA button placement.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        resolved: true,
        replies: []
      }
    ];

    const mockApprovals: ApprovalWorkflow[] = [
      {
        id: '1',
        status: 'pending',
        approver: mockTeamMembers[0],
        requester: mockTeamMembers[1],
        timestamp: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: '2',
        status: 'approved',
        approver: mockTeamMembers[0],
        requester: mockTeamMembers[1],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        comments: 'Looks good, approved for send!'
      }
    ];

    setTeamMembers(mockTeamMembers);
    setComments(mockComments);
    setApprovals(mockApprovals);
  };

  const inviteTeamMember = () => {
    if (!inviteEmail.trim()) return;
    
    // Simulate sending invitation
    console.log(`Inviting ${inviteEmail} to the project`);
    setInviteEmail('');
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: String(Date.now()),
      author: teamMembers[0], // Current user
      content: newComment,
      timestamp: new Date(),
      resolved: false,
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const toggleCommentResolved = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, resolved: !comment.resolved }
        : comment
    ));
  };

  const updateMemberRole = (memberId: string, newRole: TeamMember['role']) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, role: newRole }
        : member
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-blue-100 text-blue-700';
      case 'editor': return 'bg-green-100 text-green-700';
      case 'viewer': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Collaboration Hub</h3>
          <Badge variant="secondary" className="ml-auto">
            {teamMembers.filter(m => m.isOnline).length} online
          </Badge>
        </div>

        <div className="flex gap-1">
          {[
            { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" />, count: teamMembers.length },
            { id: 'comments', label: 'Comments', icon: <MessageSquare className="w-4 h-4" />, count: comments.filter(c => !c.resolved).length },
            { id: 'approvals', label: 'Approvals', icon: <CheckCircle className="w-4 h-4" />, count: approvals.filter(a => a.status === 'pending').length }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Invite by email..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={inviteTeamMember} disabled={!inviteEmail.trim()}>
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {member.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-gray-600">{member.email}</div>
                          <div className="text-xs text-gray-500">
                            {member.isOnline ? 'Online' : `Last seen ${member.lastSeen.toLocaleTimeString()}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getRoleColor(member.role)}`}>
                          {member.role}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-3 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Permission Levels</span>
                </div>
                <div className="space-y-1 text-xs text-blue-800">
                  <div><strong>Owner:</strong> Full access, billing, team management</div>
                  <div><strong>Admin:</strong> All features except billing</div>
                  <div><strong>Editor:</strong> Can edit and collaborate</div>
                  <div><strong>Viewer:</strong> Read-only access</div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addComment()}
                />
                <Button onClick={addComment} disabled={!newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {comments.map((comment) => (
                  <Card key={comment.id} className={`p-3 ${comment.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {comment.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">
                          {comment.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCommentResolved(comment.id)}
                        className="text-xs"
                      >
                        {comment.resolved ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                    
                    {comment.replies.length > 0 && (
                      <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs">{reply.author.name}</span>
                              <span className="text-xs text-gray-500">
                                {reply.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {comment.resolved && (
                      <Badge variant="outline" className="mt-2 text-xs text-green-600 bg-green-50">
                        Resolved
                      </Badge>
                    )}
                  </Card>
                ))}
                
                {comments.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No comments yet</p>
                    <p className="text-xs text-gray-500">Start a discussion about this email</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Approval Workflows</h4>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>

              <div className="space-y-3">
                {approvals.map((approval) => (
                  <Card key={approval.id} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {approval.requester.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{approval.requester.name}</span>
                        <span className="text-xs text-gray-500">requested approval</span>
                      </div>
                      
                      <Badge className={`text-xs ${getStatusColor(approval.status)}`}>
                        {approval.status}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      Approver: {approval.approver.name} • {approval.timestamp.toLocaleString()}
                    </div>
                    
                    {approval.comments && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {approval.comments}
                      </p>
                    )}
                    
                    {approval.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Request Changes
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
                
                {approvals.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No approvals needed</p>
                    <p className="text-xs text-gray-500">All changes are automatically approved</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
