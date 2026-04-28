import * as Auth from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await Auth.register(name, email, password);
    res.status(201).json(result);
});
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await Auth.login(email, password);
    res.json(result);
});
