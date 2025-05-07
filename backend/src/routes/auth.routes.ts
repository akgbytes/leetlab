import { Router } from "express";
const router = Router();

import { register, login, logout } from "../controllers/auth.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isLoggedIn, logout);

export default router;
