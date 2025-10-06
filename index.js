/** @format */

import express from "express";
import chalk from "chalk";
import path from "path";

import multer from "multer";
import cors from "cors";

import OpenAI from "openai";

import { getDirname } from "./utils/dirname.js";
import cookieParser from "cookie-parser";
import "./db/index.js";
import { errorHandler, authenticate } from "./middlewares/index.js";
import { userRouter, contactRouter, authRouter } from "./routers/index.js";
import chatRouter from "./routers/chat.router.js";

const app = express();
const port = process.env.PORT || 3000;

//app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
// app.use(cors({credentials: true, origin: "http://localhost:5173" || "https://evergift-frontend.onrender.com"}));
const allowedOrigins = [
  "https://evergift-frontend.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());

// get the dirname of the current file
const { __dirname, __filename } = getDirname(import.meta.url);
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public"))); //backend/public

app.get("/health", async (_req, res) => {
  res.json({ msg: "Running" });
});

// public auth routes
app.use("/auth", authRouter);

// protected routes
app.use(authenticate);
app.use("/users", userRouter);
app.use("/contacts", contactRouter);

app.use("/ai", chatRouter);

app.use("/{*splat}", (req, _res) => {
  throw new Error(`URL unavailable; you used ${req.originalUrl}`, {
    cause: 404,
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(chalk.bgGreen(` Server listening on port ${port} `));
});
