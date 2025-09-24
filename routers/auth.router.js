import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/index.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";

const authRouter = Router();
//********** Auth users **********
authRouter.route("/register").post(validate(registerSchema), register);
authRouter.route("/login").post(validate(loginSchema), login);
authRouter.route("/logout").delete(logout);

export default authRouter;
