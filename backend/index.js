import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js"; //Yaha jo file import kare usme end me .js lagana jaruri hai. Agar nahi lagayenge to error aayega ki module not found. Isliye hamesha .js lagana chahiye jab hum kisi file ko import karte hain.
import authRouter from "./routes/auth.routes.js";
import itemRouter from "./routes/item.routes.js"; // Import the itemRouter
import orderRouter from "./routes/order.routes.js";
import shopRouter from "./routes/shop.routes.js";
import userRouter from "./routes/user.routes.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io); // Set the io instance in the app locals for access in routes
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cookieParser());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Simple root route to verify server is running
app.get("/", (req, res) => {
  res.json({ message: "API server is running" });
});

app.use("/api/auth", authRouter); //Yaha pe humne authRouter ko /api/auth ke under use kiya hai. Iska matlab hai ki jab bhi koi request /api/auth ke under aayegi to wo authRouter ke routes ko handle karega. Jaise ki /api/auth/signup, /api/auth/signin, /api/auth/signout etc. Isliye humne authRouter ko /api/auth ke under use kiya hai.
app.use("/api/user", userRouter); //Yaha pe humne userRouter ko /api/user ke under use kiya hai. Iska matlab hai ki jab bhi koi request /api/user ke under aayegi to wo userRouter ke routes ko handle karega. Jaise ki /api/user/current etc. Isliye humne userRouter ko /api/user ke under use kiya hai.
app.use("/api/shop", shopRouter); //Yaha pe humne shopRouter ko /api/shop ke under use kiya hai. Iska matlab hai ki jab bhi koi request /api/shop ke under aayegi to wo shopRouter ke routes ko handle karega. Jaise ki /api/shop/create-edit, /api/shop/get-my etc. Isliye humne shopRouter ko /api/shop ke under use kiya hai.
// Catch-all 404 handler for unknown routes
app.use("/api/item", itemRouter); //Yaha pe humne itemRouter ko /api/item ke under use kiya hai. Iska matlab hai ki jab bhi koi request /api/item ke under aayegi to wo itemRouter ke routes ko handle karega. Jaise ki /api/item/add-item, /api/item/edit-item/:itemId etc. Isliye humne itemRouter ko /api/item ke under use kiya hai.
app.use("/api/order", orderRouter); //Yaha pe humne orderRouter ko /api/order ke under use kiya hai. Iska matlab hai ki jab bhi koi request /api/order ke under aayegi to wo orderRouter ke routes ko handle karega. Jaise ki /api/order/place-order etc. Isliye humne orderRouter ko /api/order ke under use kiya hai.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
