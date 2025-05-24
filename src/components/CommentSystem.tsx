
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Reply, Check, X, MoreHorizontal } from 'lucide-react';
import { useCollaboration } from './CollaborationProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CommentSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommentSystem: React.FC<CommentSystemProps> = ({ isOpen, onClose }) => {
  const { comments, addComment } = useCollaboration();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentData = {
        id: `comment-${Date.now()}`,
        content: newComment,
        author: 'Current User', // This should come from auth context
        timestamp: new Date(),
        resolved: false,
        position: 0, // This should be the current cursor position
        replies: []
      };
      addComment(commentData);
      setNewComment('');
    }
  };

  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      // Implementation for adding reply
      setReplyText('');
      setReplyingTo(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Comments</h3>
            <Badge variant="secondary" className="text-xs">
              {comments.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-3">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {comment.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500">
                      {comment.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {comment.resolved && (
                      <Badge variant="outline" className="text-xs">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {comment.content}
                  </p>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(comment.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                    
                    {!comment.resolved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-green-600 hover:text-green-700"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    )}

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-32" align="end">
                        <div className="space-y-1">
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-red-600">
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-3 space-y-2 border-l-2 border-gray-100 pl-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {reply.author.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-900">
                                {reply.author}
                              </span>
                              <span className="text-xs text-gray-500">
                                {reply.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[60px] text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                          className="h-7 px-3 text-xs"
                        >
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="h-7 px-3 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Add Comment */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="flex-1"
            >
              Comment
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
