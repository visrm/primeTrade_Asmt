import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "./utils/dbConnect.js";

// api-routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import toDoRoute from "./routes/toDo.route.js";

dotenv.config({});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialise app
const app = new express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// middlewares
app.use(express.json({ limit: "5mb" })); // to parse req.body - limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true, limit: "5mb" })); // to parse form data(urlencoded)
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// route apis'
app.use("/api/v0/auth", authRoute);
app.use("/api/v0/users", userRoute);
app.use("/api/v0/todos", toDoRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  await dbConnect();
});
