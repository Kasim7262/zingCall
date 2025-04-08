'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Chat, Channel, MessageInput, MessageList } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { tokenProvider } from '@/actions/stream.actions';
import { StreamChat } from 'stream-chat';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

interface ChatComponentProps {
  callId: string | string[]; // Ensure you properly type this as `string | string[]`
}

export const ChatComponent = ({ callId }: ChatComponentProps) => {
    const { user, isLoaded } = useUser();
    const [chatClient, setChatClient] = useState<StreamChat | null>(null);
    useEffect(() => {
        if (!isLoaded || !user) return;
        if (!API_KEY) throw new Error('Stream API key is missing');
        
        const initChat = async () => {
          try {
            const client = StreamChat.getInstance(API_KEY);

            await client.connectUser(
             {
              id:user?.id,
              name:user?.username || user?.id,
              image:user?.imageUrl,
             },
             tokenProvider,
            );
    
            setChatClient(client);
          } catch (error) {
            console.error('Failed to initialize chat:', error);
          } 
        };


        if (callId) {
          initChat();
        } else {
          console.log('Missing or invalid Call ID');
          // setIsLoading(false);
        }
    }, [callId, isLoaded, user]);
  // if (!chatClient) return <Loader/>;
  if (!chatClient) {
    console.error("Chat client is not initialized!");
    return null; // Or render a loading state
  }


  if (!callId) {
    return <div>Invalid Call ID</div>;
  }
  
  const channel = chatClient.channel('livestream', `meeting-${callId}`);
  if (!channel) {
    return <div>Failed to load chat channel</div>;
  }

  return (
    <div className="mb-12 h-full w-80 flex flex-col overflow-hidden rounded-lg bg-dark-2 text-white">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='flex flex-col justify-between rounded-lg'>
            <div className="flex flex-col rounded-t-lg overflow-auto ">
              <MessageList />
              
            </div>
            <div className="rounded-b-lg p-2">
              <MessageInput />
            </div>
          </div>
        </Channel>
      </Chat>
    </div>
  );
};