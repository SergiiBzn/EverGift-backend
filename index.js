/** @format */

import express from "express";
import chalk from "chalk";
import path from "path";

import multer from "multer";
import cors from "cors";

import { getDirname } from "./utils/dirname.js";
import cookieParser from "cookie-parser";
import "./db/index.js";
import { errorHandler, authenticate } from "./middlewares/index.js";
import { userRouter, contactRouter, authRouter } from "./routers/index.js";

const app = express();
const port = process.env.PORT || 3000;

//app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
// app.use(cors({credentials: true, origin: "http://localhost:5173" || "https://evergift-frontend.onrender.com"}));
const allowedOrigins = [
  "https://evergift-frontend.onrender.com",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

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

app.use("/{*splat}", (req, _res) => {
  throw new Error(`URL unavailable; you used ${req.originalUrl}`, {
    cause: 404,
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(chalk.bgGreen(` Server listening on port ${port} `));
});
