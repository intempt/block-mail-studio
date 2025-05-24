
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  Send, 
  Check, 
  Eye,
  UserPlus,
  Settings,
  MoreVertical,
  Reply,
  Clock
} from 'lucide-react';
import { CollaborationService, User, Comment, CollaborationEvent } from '@/services/collaborationService';

interface RealTimeCollaborationProps {
  onUserJoin?: (user: User) => void;
  onCommentAdd?: (comment: Comment) => void;
}

export const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({
  onUserJoin,
  onCommentAdd
}) => {
  const [collaborationService] = useState(() => CollaborationService.getInstance());
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize collaboration session
    const initCollaboration = async () => {
      const user: User = {
        id: `user_${Date.now()}`,
        name: 'You',
        email: 'you@example.com',
        color: '#6366F1',
        isOnline: true,
        lastSeen: new Date()
      };
      
      await collaborationService.initSession(user);
      setCurrentUser(user);
    };

    initCollaboration();

    // Set up event listeners
    const handleUserJoin = (event: CollaborationEvent) => {
      updateUsers();
      onUserJoin?.(event.data);
    };

    const handleUserLeave = (event: CollaborationEvent) => {
      updateUsers();
    };

    const handleCommentAdd = (event: CollaborationEvent) => {
      updateComments();
      onCommentAdd?.(event.data);
    };

    const handleCommentResolve = () => {
      updateComments();
    };

    collaborationService.on('user-join', handleUserJoin);
    collaborationService.on('user-leave', handleUserLeave);
    collaborationService.on('comment-add', handleCommentAdd);
    collaborationService.on('comment-resolve', handleCommentResolve);

    // Initial data load
    updateUsers();
    updateComments();

    return () => {
      collaborationService.off('user-join', handleUserJoin);
      collaborationService.off('user-leave', handleUserLeave);
      collaborationService.off('comment-add', handleCommentAdd);
      collaborationService.off('comment-resolve', handleCommentResolve);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const updateUsers = () => {
    setOnlineUsers(collaborationService.getOnlineUsers());
  };

  const updateComments = () => {
    setComments(collaborationService.getComments());
  };

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    collaborationService.addComment(newComment);
    setNewComment('');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    collaborationService.addReply(commentId, replyContent);
    setReplyContent('');
    setReplyingTo(null);
    updateComments();
  };

  const handleResolveComment = (commentId: string) => {
    collaborationService.resolveComment(commentId);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-semibold">Collaboration</h3>
            <Badge variant="secondary" className="text-xs">
              {onlineUsers.length} online
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Online Users */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 4).map((user) => (
              <Avatar key={user.id} className="w-6 h-6 border-2 border-white">
                <AvatarFallback 
                  className="text-xs text-white"
                  style={{ backgroundColor: user.color }}
                >
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {onlineUsers.length > 4 && (
              <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{onlineUsers.length - 4}</span>
              </div>
            )}
          </div>
          
          <Button variant="outline" size="sm" className="ml-auto">
            <UserPlus className="w-3 h-3 mr-1" />
            Invite
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Comments ({comments.length})</span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                {/* Main Comment */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {getInitials(comment.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(comment.id)}
                        className="text-xs h-6 px-2"
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResolveComment(comment.id)}
                        className="text-xs h-6 px-2"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  
                  {comment.blockId && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      Block: {comment.blockId}
                    </Badge>
                  )}
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-6 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-white border rounded-lg p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-4 h-4">
                            <AvatarFallback className="text-xs">
                              {getInitials(reply.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-gray-900">
                            {reply.userName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="ml-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="text-xs"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddReply(comment.id);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddReply(comment.id)}
                        disabled={!replyContent.trim()}
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No comments yet</p>
                <p className="text-xs text-gray-400">Start a conversation!</p>
              </div>
            )}
            
            <div ref={commentsEndRef} />
          </div>
        </ScrollArea>

        {/* Comment Input */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
