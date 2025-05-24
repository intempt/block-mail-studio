
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff } from 'lucide-react';
import { useCollaboration } from './CollaborationProvider';

export const PresenceIndicator: React.FC = () => {
  const { collaborators, isConnected } = useCollaboration();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Connection status */}
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {isConnected ? 'Connected to collaboration server' : 'Disconnected'}
          </TooltipContent>
        </Tooltip>

        {/* Collaborator avatars */}
        <div className="flex -space-x-2">
          {collaborators.slice(0, 5).map((collaborator) => (
            <Tooltip key={collaborator.userId}>
              <TooltipTrigger>
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarFallback 
                    className="text-xs font-medium text-white"
                    style={{ backgroundColor: collaborator.userColor }}
                  >
                    {collaborator.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: collaborator.userColor }}
                  />
                  {collaborator.userName}
                  {collaborator.isOnline && (
                    <Badge variant="secondary" className="text-xs">
                      Online
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {collaborators.length > 5 && (
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="w-8 h-8 border-2 border-white bg-gray-100">
                  <AvatarFallback className="text-xs font-medium text-gray-600">
                    +{collaborators.length - 5}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                {collaborators.length - 5} more collaborator{collaborators.length - 5 > 1 ? 's' : ''}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {collaborators.length > 0 && (
          <span className="text-sm text-gray-600 ml-2">
            {collaborators.length} other{collaborators.length > 1 ? 's' : ''} editing
          </span>
        )}
      </div>
    </TooltipProvider>
  );
};
