import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  getOutgoingFriendsReqs,
  getRecommendedUsers,
  getuserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  UsersIcon,
  MapPinIcon,
  CheckCircleIcon,
  UserPlusIcon,
  GlobeIcon,
  UserCheckIcon,
  SparklesIcon,
} from "lucide-react";
import FriendCard from "../components/FriendCard";
import { getLanguageFlag } from "../lib/languageFlag.jsx";
import NofriendsFound from "../components/NofriendsFound";
import { capitialize } from "../lib/utils";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { isLoading: loadingFriends, data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getuserFriends,
  });

  const { isLoading: loadingUsers, data: recommendeUsers = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendsReqs = [] } = useQuery({
    queryKey: ["outgoingFriendsReqs"],
    queryFn: getOutgoingFriendsReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendsReqs"] });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendsReqs && outgoingFriendsReqs.length > 0) {
      outgoingFriendsReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendsReqs]);

  const onlineFriends = friends.filter((f) => f.isOnboarded).length;

  return (
    <div className="min-h-screen bg-base-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
          <div className="relative px-6 sm:px-8 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-base-content tracking-tight">
                  Welcome back! 👋
                </h1>
                <p className="text-base-content/60 mt-1.5 text-sm sm:text-base">
                  Ready to practice your language skills today?
                </p>
              </div>
              <Link
                to="/notifications"
                className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20"
              >
                <UsersIcon className="size-4" />
                Friend Requests
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 border border-base-300/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <UserCheckIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider font-medium">Friends</p>
                    <p className="text-xl font-bold text-base-content">{friends.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 border border-base-300/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10 text-success">
                    <UsersIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider font-medium">Online</p>
                    <p className="text-xl font-bold text-base-content">{onlineFriends}</p>
                  </div>
                </div>
              </div>
              <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 border border-base-300/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                    <GlobeIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider font-medium">Languages</p>
                    <p className="text-xl font-bold text-base-content">
                      {new Set(friends.map((f) => f.nativeLanguage).filter(Boolean)).size}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-base-100/80 backdrop-blur-sm rounded-xl p-4 border border-base-300/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <SparklesIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase tracking-wider font-medium">Requests</p>
                    <p className="text-xl font-bold text-base-content">{outgoingFriendsReqs.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Friends Preview Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-base-content tracking-tight">
                Your Friends
              </h2>
              <p className="text-sm text-base-content/50 mt-0.5">
                {friends.length > 0
                  ? `You have ${friends.length} friend${friends.length !== 1 ? "s" : ""}`
                  : "Start connecting with language partners"}
              </p>
            </div>
            <Link to="/friends" className="btn btn-outline btn-sm gap-2 w-full sm:w-auto">
              <UsersIcon className="size-4" />
              View All
            </Link>
          </div>
          {loadingFriends ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : friends.length === 0 ? (
            <NofriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.slice(0, 4).map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* Discover Section */}
        <section className="pb-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-base-content tracking-tight">
                  Meet New Learners
                </h2>
                <p className="text-sm text-base-content/50 mt-0.5">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>
          {loadingUsers ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : recommendeUsers.length === 0 ? (
            <div className="card bg-base-200 border border-base-300/50 p-8 text-center">
              <div className="p-3 rounded-full bg-base-300/50 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <UsersIcon className="size-6 text-base-content/40" />
              </div>
              <h3 className="font-semibold text-lg mb-1">No recommendations available</h3>
              <p className="text-sm text-base-content/50">Check back later for new language partners!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendeUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    className="group card bg-base-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 border border-base-300/50 hover:-translate-y-0.5"
                    key={user._id}
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="avatar">
                          <div className="w-14 h-14 rounded-full ring-2 ring-base-300 group-hover:ring-primary/30 transition-all">
                            <img
                              src={user.profilePic}
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-base-content truncate">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs text-base-content/50 mt-1">
                              <MapPinIcon className="size-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                          {user.bio && (
                            <p className="text-xs text-base-content/40 mt-1.5 line-clamp-2 leading-relaxed">
                              {user.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary badge-sm gap-1">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline badge-sm gap-1">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <button
                        className={`btn w-full gap-2 ${
                          hasRequestBeenSent
                            ? "btn-disabled btn-ghost"
                            : "btn-primary shadow-lg shadow-primary/20"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;