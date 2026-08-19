import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getuserFriends } from "../lib/api";
import { UsersIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NofriendsFound from "../components/NofriendsFound";

const FriendsPage = () => {
  const { isLoading: loadingFriends, data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getuserFriends,
  });

  return (
    <div className="min-h-screen bg-base-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-base-content tracking-tight">
                Your Friends
              </h1>
              <p className="text-sm text-base-content/50 mt-1">
                {friends.length > 0
                  ? `You have ${friends.length} friend${friends.length !== 1 ? "s" : ""}`
                  : "Start connecting with language partners"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/60 bg-base-100 px-4 py-2 rounded-lg border border-base-300/50">
              <UsersIcon className="size-4" />
              <span>{friends.length} total</span>
            </div>
          </div>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : friends.length === 0 ? (
          <NofriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;