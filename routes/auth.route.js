import express from "express";
import { register } from "../controllers/auth.controllers.js";
import { login } from "../controllers/auth.controllers.js";
import { forgetpassword } from "../controllers/auth.controllers.js";
import { resetPassword } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/forgot-password', forgetpassword)
router.post('/reset-password/:id/:token', resetPassword)
export default router;
