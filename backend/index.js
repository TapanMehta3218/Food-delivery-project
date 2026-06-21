import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js"; //Yaha jo file import kare usme end me .js lagana jaruri hai. Agar nahi lagayenge to error aayega ki module not found. Isliye hamesha .js lagana chahiye jab hum kisi file ko import karte hain.
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); //Yaha pe humne cors middleware ko use kiya hai. Iska matlab hai ki hum apne backend server ko frontend server ke sath communicate karne ke liye allow kar rahe hain. Yaha pe origin me humne frontend server ka url diya hai. Aur credentials: true ka matlab hai ki hum apne backend server ko frontend server ke sath cookies share karne ke liye allow kar rahe hain. Isliye humne cors middleware ko use kiya hai.
app.use("/api/auth", authRouter); //Yaha pe humne authRouter ko /api/auth ke under use kiya hai. Iska matlab hai ki jab bhi koi request /api/auth ke under aayegi to wo authRouter ke routes ko handle karega. Jaise ki /api/auth/signup, /api/auth/signin, /api/auth/signout etc. Isliye humne authRouter ko /api/auth ke under use kiya hai.
app.use("/api/user", userRouter); //Yaha pe humne userRouter ko /api/user ke under use kiya hai. Iska matlab hai ki jab bhi koi request /api/user ke under aayegi to wo userRouter ke routes ko handle karega. Jaise ki /api/user/current etc. Isliye humne userRouter ko /api/user ke under use kiya hai.
try {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
  });
} catch (error) {
  console.error("Error starting the server:", error);
}
