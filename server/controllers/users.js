import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) return res.status(400).json({ message: "Missing query param" });

    const regex = new RegExp(query, "i"); // case-insensitive

    const users = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }],
    }).select("firstName lastName picturePath location"); // adjust fields as needed

    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to search users", error: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateSocials = async (req, res) => {
  try {
    const { id, social } = req.params;
    const user = await User.findById(id);
    if (user) {
      if (social === "linkedin") {
        user.socials.linkedin = req.body.linkedin;
      } else if (social === "twitter") {
        user.socials.twitter = req.body.twitter;
      }
      await user.save();
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
