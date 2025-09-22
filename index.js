import express from "express";
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./db/index.js";
import { errorHandler } from "./middlewares/index.js";
<<<<<<< HEAD
=======
import { userRouter, contactRouter } from "./routes/index.js";
>>>>>>> 276e2cd3154d9aaf9288e3c14cde2f2f138ccb1d

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json(), cookieParser());
app.use(cors());

app.get("/health", async (_req, res) => {
  res.json({ msg: "Running" });
});

<<<<<<< HEAD
=======
app.use("/users", userRouter);
app.use("/contacts", contactRouter);

>>>>>>> 276e2cd3154d9aaf9288e3c14cde2f2f138ccb1d
app.use("/{*splat}", (req, _res) => {
  throw new Error(`URL unavailable; you used ${req.originalUrl}`, {
    cause: 404
  });
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(chalk.bgGreen(` Server listening on port ${port} `));
});
