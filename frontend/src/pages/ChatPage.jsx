import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuth.User";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import ChatLoader from   "../components/ChatLoader"

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const {
    data: tokenData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run when the authUser is there
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;
      try {
        console.log("Initializing stream chat client ....");
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );
        const channelId = [authUser._id, targetUserId].sort().join("-");
        // yout and me
        // if i start then channelId  = [myid , yourid]
        // if another user start then channelId  = [userdi of that user , myId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch(); // this will see the changes

        setChatClient(client);
        setChannel(currChannel);
      } catch (err) {
        console.log("Error initializing chat :", err);
        toast.error(" could not connect to chat please try again")
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, []);

  if(loading || !chatClient || !channel) return <ChatLoader/>

  return <div>ChatPage</div>;
};

export default ChatPage;
