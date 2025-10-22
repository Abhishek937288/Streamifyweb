import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuth.User";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import PageLoader from "../components/PageLoader";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  name,
} from "@stream-io/video-react-sdk";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import CallContent from "../components/CallContent";

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData.token || !authUser || !callId) return;
      try {
        console.log("Initilizing stream video client ...");
        const user = {
          id: authUser._id,
          name: authUser.name,
          image: authUser.profilePic,
        };
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });
        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });
        console.log("joined call successfully");
        setClient(videoClient);
        setCall(callInstance);
      } catch (err) {
        console.log("Error in joining call :", err);
        toast.error("could not join the call");
      } finally {
        setIsConnecting(false);
      }
    };
    initCall();
  }, [tokenData, authUser, callId]);
  if (isLoading || isConnecting) return <PageLoader />;
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initilize call . please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallPage;
