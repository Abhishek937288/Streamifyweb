import React from "react";
import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";
import { getLanguageFlag } from "../lib/languageFlag.jsx";

const FriendCard = ({ friend }) => {
  return (
    <div className="group card bg-base-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 border border-base-300/50 hover:-translate-y-0.5">
      <div className="card-body p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="avatar">
              <div className="w-14 h-14 rounded-full ring-2 ring-base-300 group-hover:ring-primary/40 transition-all duration-300">
                <img
                  src={friend.profilePic}
                  alt={friend.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full ring-2 ring-base-100"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-base-content truncate group-hover:text-primary transition-colors">
              {friend.fullName}
            </h3>
            <p className="text-xs text-success flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              Online
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="badge badge-secondary badge-sm gap-1">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline badge-sm gap-1">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <div className="mt-4">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-primary btn-sm w-full gap-2 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all"
          >
            <MessageCircleIcon className="size-4" />
            Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;