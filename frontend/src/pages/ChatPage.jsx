import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuth.User";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import ChatLoader from "../components/ChatLoader";
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
import CallButton from "../components/CallButton";
import {
  ArrowLeftIcon,
  VideoIcon,
  PhoneIcon,
  MoreVerticalIcon,
  SmileIcon,
  PaperclipIcon,
  SendIcon,
} from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const { authUser } = useAuthUser();

  const {
    data: tokenData,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

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
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`
      channel.sendMessage({
        text: `I've started a video call. Join here: ${callUrl}`
      })
      toast.success("start your video call with this link")
    }
  };

  const CustomChannelHeader = () => {
    const otherUser = channel?.state.members?.[targetUserId]?.user;
    const displayName = otherUser?.name || otherUser?.fullName || "User";
    const displayImage = otherUser?.image || otherUser?.profilePic;

    return (
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-14 sm:h-16 bg-base-100 border-b border-base-300 sticky top-0 z-10">
        {isMobile && (
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-circle btn-sm flex-shrink-0"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
        )}
        <div className="avatar flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-primary/20">
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-base-content truncate">
            {displayName}
          </h3>
          <p className="text-xs text-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            Online
          </p>
        </div>
        <button
          onClick={handleVideoCall}
          className="btn btn-ghost btn-circle btn-sm text-primary hover:bg-primary/10 flex-shrink-0"
        >
          <VideoIcon className="size-4 sm:size-5" />
        </button>
        <button className="hidden sm:flex btn btn-ghost btn-circle btn-sm flex-shrink-0">
          <MoreVerticalIcon className="size-5" />
        </button>
      </div>
    );
  };

  const CustomMessageInput = () => {
    return (
      <div className="px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-2 bg-base-200 rounded-2xl px-4 py-2 border border-base-300/50 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <button className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-base-content">
            <PaperclipIcon className="size-5" />
          </button>
          <MessageInput
            focus
            additionalTextareaProps={{
              placeholder: "Type a message...",
              className:
                "w-full bg-transparent border-none outline-none resize-none text-sm placeholder:text-base-content/30",
            }}
          />
          <button className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-base-content">
            <SmileIcon className="size-5" />
          </button>
        </div>
      </div>
    );
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-screen flex flex-col bg-base-200">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="flex-1 flex flex-col h-full w-full bg-base-100 sm:my-4 sm:mx-4 sm:max-w-4xl sm:rounded-2xl overflow-hidden border border-base-300/50 sm:border-base-300/50">
            <CustomChannelHeader />
            <div className="flex-1 overflow-hidden bg-base-100">
              <MessageList
                className="custom-message-list"
                messageActions={[
                  "edit",
                  "delete",
                  "flag",
                  "mute",
                  "pin",
                  "quote",
                  "react",
                  "retry",
                  "save",
                  "share",
                ]}
                additionalMessageListProps={{
                  style: {
                    padding: "16px",
                    backgroundColor: "transparent",
                  },
                }}
              />
            </div>
            <CustomMessageInput />
            <Thread />
          </div>
        </Channel>
      </Chat>

      <style>{`
        .custom-message-list {
          padding: 16px !important;
          background-color: transparent !important;
        }
        .custom-message-list .str-chat__message-list {
          background-color: transparent !important;
        }
        .custom-message-list .str-chat__message-simple {
          padding: 4px 0 !important;
        }
        .custom-message-list .str-chat__message-simple .str-chat__message-bubble {
          border-radius: 16px !important;
          padding: 8px 14px !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }
        .custom-message-list .str-chat__message-simple--me .str-chat__message-bubble {
          background-color: var(--fallback-p, oklch(var(--p))) !important;
          color: var(--fallback-bc, oklch(var(--bc))) !important;
          border-bottom-right-radius: 4px !important;
        }
        .custom-message-list .str-chat__message-simple--other .str-chat__message-bubble {
          background-color: var(--fallback-b2, oklch(var(--b2))) !important;
          color: var(--fallback-bc, oklch(var(--bc))) !important;
          border-bottom-left-radius: 4px !important;
        }
        .custom-message-list .str-chat__message-simple .str-chat__message-text {
          margin: 0 !important;
          padding: 0 !important;
        }
        .custom-message-list .str-chat__message-simple .str-chat__message-attachments {
          margin: 4px 0 0 0 !important;
        }
        .custom-message-list .str-chat__message-simple .str-chat__message-replies-count-button {
          margin: 4px 0 0 0 !important;
        }
        .custom-message-list .str-chat__date-separator {
          margin: 16px 0 !important;
        }
        .custom-message-list .str-chat__date-separator .str-chat__date-separator__line {
          background-color: var(--fallback-b3, oklch(var(--b3))) !important;
        }
        .custom-message-list .str-chat__date-separator .str-chat__date-separator__text {
          background-color: transparent !important;
          padding: 0 12px !important;
          color: var(--fallback-bc, oklch(var(--bc))) !important;
          opacity: 0.5 !important;
        }
        .custom-message-list .str-chat__message-status {
          margin: 2px 4px 0 0 !important;
        }
        .custom-message-input .str-chat__message-input {
          background-color: transparent !important;
          border: none !important;
        }
        .custom-message-input .str-chat__message-input .str-chat__message-input-textarea {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .str-chat__message-input .str-chat__message-input-trigger {
          background-color: transparent !important;
        }
        .custom-message-list .str-chat__avatar--rounded {
          border-radius: 50% !important;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;