import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { sendOtpMail } from "../utils/mail.js";
import genToken from "../utils/token.js";
dotenv.config();

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    if (!fullName || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (mobile.length !== 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be 10 digits long" });
    }
    if (!["user", "owner", "deliveryBoy"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be either user, owner or deliveryBoy" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email, //key aur value same ho then no nned to write them differently
      password: hashedPassword,
      mobile,
      role,
    });
    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error in signUp controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await genToken(userExists._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ message: "User signed in successfully", user: userExists });
  } catch (error) {
    console.error("Error in signIn controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    console.error("Error in signOut controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    user.isOtpVerified = false; // false kyuki abhi tak verify nai hua hai
    await user.save();
    // Send OTP email
    await sendOtpMail(email, otp);
    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in sendOtp controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification is required" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false; // reset OTP verification status
    await user.save(); // password reset hone ke baad user ko dobara OTP verify karna padega agar wo password reset karna chahta hai to. isliye isOtpVerified ko false kar diya hai.
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;
    if (!fullName || !email || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let user = await User.findOne({ email }); //user ko change kar rahe isliye let se initialize kiya hai
    if (!user) {
      user = await User.create({
        fullName,
        email,
        mobile,
        password: "", // Google auth users won't have a password
        role,
      });
    }
    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ message: "User authenticated successfully", user });
  } catch (error) {
    console.error("Error in googleAuth controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
