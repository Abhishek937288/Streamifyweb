import React from "react";
import { Link } from "react-router";
import { UsersIcon, UserPlusIcon } from "lucide-react";

const NofriendsFound = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="p-4 rounded-full bg-base-300/50 w-20 h-20 flex items-center justify-center mx-auto mb-4">
        <UsersIcon className="size-10 text-base-content/30" />
      </div>
      <h3 className="text-xl font-semibold text-base-content mb-2">No friends yet</h3>
      <p className="text-base-content/50 mb-6 max-w-sm mx-auto">
        Connect with language partners below to start practicing together!
      </p>
      <Link to="/" className="btn btn-primary gap-2 shadow-lg shadow-primary/20">
        <UserPlusIcon className="size-4" />
        Discover Partners
      </Link>
    </div>
  );
};

export default NofriendsFound;