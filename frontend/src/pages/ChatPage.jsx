import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuth.User";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import ChatLoader from "../components/ChatLoader";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import {
  ArrowLeftIcon,
  MoreVerticalIcon,
  PaperclipIcon,
} from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const fileInputRef = useRef(null);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
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
        console.log("Error initializing chat:", err);
        toast.error("Could not connect to chat, please try again");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, targetUserId]);

  const { setHandleVideoCall } = useChatStore();

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join here: ${callUrl}`,
      });
      toast.success("Video call link sent!");
    }
  };

  useEffect(() => {
    if (channel) {
      setHandleVideoCall(() => handleVideoCall);
    }
    return () => setHandleVideoCall(null);
  }, [channel, setHandleVideoCall]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && channel) {
      channel.sendFile(file);
      toast.success("File attached!");
    }
    e.target.value = "";
  };

  const CustomChannelHeader = () => {
    const otherUser = channel?.state.members?.[targetUserId]?.user;
    const displayName = otherUser?.name || otherUser?.fullName || "User";
    const displayImage = otherUser?.image || otherUser?.profilePic;

    return (
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-14 sm:h-16 bg-base-100 border-b border-base-300 flex-shrink-0">
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
        <button className="hidden sm:flex btn btn-ghost btn-circle btn-sm flex-shrink-0">
          <MoreVerticalIcon className="size-5" />
        </button>
      </div>
    );
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-full flex flex-col bg-base-200">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="flex-1 flex flex-col h-full w-full bg-base-100 lg:mx-auto lg:max-w-6xl lg:rounded-t-2xl overflow-hidden lg:border lg:border-b-0 lg:border-base-300/50">
            <CustomChannelHeader />
            <div className="flex-1 overflow-y-auto bg-base-100">
              <MessageList
                className="custom-message-list"
                messageActions={["edit", "delete", "quote", "react", "reply"]}
                additionalMessageListProps={{
                  style: {
                    padding: "16px",
                    backgroundColor: "transparent",
                  },
                }}
              />
            </div>
            <div className="flex-shrink-0 bg-base-100 border-t border-base-300 relative">
              <div className="flex items-center gap-1 px-4 py-3 sm:px-6 sm:py-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-ghost btn-circle btn-sm text-base-content/50 hover:text-base-content flex-shrink-0"
                >
                  <PaperclipIcon className="size-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex-1">
                  <MessageInput
                    focus
                    emojiPicker
                    additionalTextareaProps={{
                      placeholder: "Type a message...",
                    }}
                  />
                </div>
              </div>
            </div>
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
        .custom-message-list .str-chat__avatar--rounded {
          border-radius: 50% !important;
        }
        .str-chat .str-chat__message-input {
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
          padding: 0 !important;
        }
        .str-chat .str-chat__message-input--textarea {
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
