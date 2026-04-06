import { Router } from "express";
import { validateBody } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "@yovid/shared";
import * as C from "./auth.controller.js";
const r = Router();
r.post("/register", validateBody(registerSchema), C.register);
r.post("/login", validateBody(loginSchema), C.login);
export default r;
