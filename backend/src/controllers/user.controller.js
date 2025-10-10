import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const recommendUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // the userId which is not equal to
        //current userId to exlude current user
        { $ne: currentUser.friends }, //  to exlude currentusers friends
      ],
    });

    return res.status(200).json(recommendUsers);
  } catch (err) {
    console.log("error in getting the reccommnded users", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    return res.status(200).json(user.friends);
  } catch (err) {
    console.error("Error in sendFriendRequest controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// $ne not equal to $and to check both conditions
// select(friends) gives only friends from the database of the users  eg. {friends:[{_id} all frineds ids]}

// populate replace the id with their  data like username fullname ... for tempory in that array not save in friends databse array

// TODO NEED TO REVISE THE MONGOOSE POWER QUERIES
