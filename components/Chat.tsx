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
import { StreamChat } from 'stream-chat';
// import { StreamChat } from '@stream-io/stream-chat';
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
            const client = StreamChat.getInstance(API_KEY);
            // const client = useCreateChatClient({
            //   apiKey: API_KEY,
            //   tokenOrProvider:tokenProvider,

            //     userData: {
            //         id: user?.id,
            //         name: user?.username || user?.id,
            //         image: user?.imageUrl,
            //     },
            // });

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
            // Handle error (show error message, etc.)
            // toast("Message failed to load");
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
    <div className="h-full w-80 bg-dark-2 text-white rounded-lg overflow-hidden flex flex-col mb-12">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='flex flex-col justify-between rounded-lg'>
            <div className="flex flex-col overflow-auto rounded-t-lg">
              <MessageList />
              
            </div>
            <div className="p-2 rounded-b-lg">
              <MessageInput />
            </div>
          </div>
        </Channel>
      </Chat>
    </div>
  );
};