import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username: username }).select("-password");
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });

    return res.status(200).json({
      message: "User info fetched.",
      user,
      success: true,
    });
  } catch (error) {
    console.log("Error in getProfile: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

export const updateUser = async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;
  let { profile } = req.body;
  try {
    var user = await User.findById(req.id);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });

    if ((!currentPassword && newPassword) || (currentPassword && !newPassword))
      return res.status(400).json({
        message: "Please provide both current & new password.",
        success: false,
      });

    if (currentPassword && newPassword) {
      let isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Invalid password.",
          success: false,
        });

      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (profile) {
      // update profileImg
      if (profile.profileImg) {
        if (user.profile.profileImg)
          await cloudinary.uploader.destroy(
            user.profile.profileImg.split("/").pop().split(".")[0]
          );

        const uploadedResponse = await cloudinary.uploader.upload(
          profile.profileImg
        );
        user.profile.profileImg = uploadedResponse.secure_url;
      }

      if (profile.bio) user.profile.bio = profile.bio;
    } 

    user.username = username || user.username;
    user.email = email || user.email;

    user = await user.save();
    user.password = null;

    return res.status(200).json({
      message: "User updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};
