import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
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

export const sendFriendRequest = async (req, res) => {
  try {
    // get the sender if from the req.user( middelware);
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "you cannot send request to yourself" });
    }
    const recipient = await User.findById(recipientId);
    // will check the recipient is onBoarded or not
    if (!recipient) {
      return res.status(400).json({ message: "Recipient is not valid" });
    }

    // this will check your are allready friend or not
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({
        message: "user are already friends",
      });
    }

    // this will check sender or reciever already friendRequest sent or not by check both end for reciver and sender aswell
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend Request already existed between the user",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    return res.status(201).json(friendRequest);
  } catch (err) {
    console.log("error while sending frirend Request", err);
    return res.status(400).json({ message: "internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    // this will check friend request is friend sent or not by the sender
    if (!friendRequest) {
      return res.status(400).json({ message: "friend request not sent" });
    }

    // this will check friend request reciever is correct or not
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorised to accetpt this request" });
    }

    // if in friend request document it matches with their sender id and recipient id then accepted the request
    friendRequest.status = "accepted";
    await friendRequest.save();

    // this will add the recipeint in the the sender friends
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    // this will add the sender in the the   recipeint friends
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    return res
      .status(200)
      .json({ message: "Friend request accepted successfully" });
  } catch (err) {
    console.log("error while accepting frirend Request", err);
    return res.status(400).json({ message: "internal server error" });
  }
};
 