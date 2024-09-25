import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.route.mjs";
import userRoutes from "./routes/users.route.mjs";
import postRoutes from "./routes/posts.route.mjs";
import { register } from "./controllers/authController.mjs";
import { createPost } from "./controllers/posts.controller.mjs";
import { verifyToken } from "./middleware/authMiddleware.mjs";
import User from "./models/User.models.mjs";
import Post from "./models/Post.model.mjs";
import { users, posts } from "./data/index.mjs";

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(express.json());
app.use(morgan("common"));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* ROUTES WITH FILES */

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//ROUTES

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`running on port ${PORT}`));

    //1 time!!!
    // User.insertMany(users);
    //Post.insertMany(posts);
  })
  .catch((error) => console.log(error));
