import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const recommendUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // the userId which is not equal to current userId to exlude current user
        { $ne: currentUser.friends }, //  to exlude currentusers friends
      ],
    });

    return res.status(200).json(recommendUsers);
  } catch (err) {
    console.log("error in getting the reccommnded users", err);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMyFriends = async (req,res)=>{
 try{}catch(err)
}

// $ne not equal to $and to check both conditions
