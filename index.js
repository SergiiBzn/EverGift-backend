/** @format */

import express from "express";
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./db/index.js";
import { errorHandler, authenticate } from "./middlewares/index.js";
import { userRouter, contactRouter, authRouter } from "./routers/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json(), cookieParser());

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
