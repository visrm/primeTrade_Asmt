import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = await req.body;

    // To check if any required fields are missing
    if (!username || !email || !password)
      return res.status(400).json({
        message: "Required field(s) are missing!",
        success: false,
      });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });

    let isExistingUser = await User.findOne({ email });
    if (isExistingUser)
      return res.status(400).json({
        message: "User already exists!",
        success: false,
      });

    let isExistingUsername = await User.findOne({ username });
    if (isExistingUsername)
      return res.status(400).json({
        message: "Username already exists!",
        success: false,
      });

    if (password.length < 8)
      return res.status(400).json({
        message: "Password isn't sufficiently long.",
        success: false,
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account successfully created!",
      success: true,
    });
  } catch (error) {
    console.log("Error in SignUp: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        message: "Required field(s) are missing!",
        success: false,
      });

    let user = await User.findOne({ email });
    const isPasswordMatching = await bcrypt.compare(
      password,
      user?.password || ""
    );
    
    if (!user || !isPasswordMatching)
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });

    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // in milliseconds(ms)
        httpsOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
      })
      .json({
        message: `${user.username} successfully logged in!`,
        user,
        success: true,
      });
  } catch (error) {
    console.log("Error in LogIn: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });

    return res.status(200).json({
      message: "User info fetched successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log("Error in getMe: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "User Logged out.",
      success: true,
    });
  } catch (error) {
    console.log("Error in LogOut: ", error.message);
    res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};
