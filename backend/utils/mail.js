import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, //jis email se mail bhejna hai uska email address
    pass: process.env.PASS, //issi email ka app password
  },
});
export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to, // yaha actually as a parameter se email address pass karna hai jisko mail bhejna hai so key param same hai isliye ek baar only
      subject: "Your OTP for Password Reset", // Subject line
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p><p>This OTP is valid for 5 minutes.</p>`, // html body . isko as as normal text bhi bhej sakte hai
    });
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};
