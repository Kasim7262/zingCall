'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCreateChatClient, Chat, Channel, MessageInput, MessageList } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
import { tokenProvider } from '@/actions/stream.actions';
import {type StreamChatClient } from '@stream-io/node-sdk';
import { toast } from './ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import type { StreamChat } from 'stream-chat';
import Loader from './Loader';


interface ChatComponentProps {
  callId: string | string[]; // Ensure you properly type this as `string | string[]`
}

export const ChatComponent = ({ callId }: ChatComponentProps) => {
    const { user, isLoaded } = useUser();
    const { call } = useGetCallById(callId);
    const [chatClient, setChatClient] = useState<StreamChat | null>(null);
    useEffect(() => {
        if (!isLoaded || !user) return;
        if (!API_KEY) throw new Error('Stream API key is missing');
        
        const initChat = async () => {
          try {
            
            const client = useCreateChatClient({
              apiKey: API_KEY,
              tokenOrProvider:tokenProvider,

                userData: {
                    id: user?.id,
                    name: user?.username || user?.id,
                    image: user?.imageUrl,
                },
            });
    
            setChatClient(client);
          } catch (error) {
            console.error('Failed to initialize chat:', error);
            // Handle error (show error message, etc.)
            // toast("Message failed to load");
          }
        };
        initChat();
    }, [isLoaded, user]);
  if (!chatClient) return <Loader/>;

  return (
    <div className="h-full w-80 bg-dark-2 rounded-lg overflow-hidden flex flex-col">
      <Chat client={chatClient}>
        <Channel channel={chatClient.channel('livestream', `meeting-${callId}`)}>
          <div className="flex-1 overflow-hidden">
            <MessageList />
          </div>
          <div className="p-2">
            <MessageInput />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};