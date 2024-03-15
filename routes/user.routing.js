import express from "express";
import { formForgotPassword, formLogin, formRegister, register, confirmAccount } from "../controllers/user.controller.js";

const router = express.Router();

// Routing
router.get('/login', formLogin);
router.get('/register', formRegister);
router.post('/register', register);
router.get('/forgotpassword', formForgotPassword);
router.get('/confirmAccount/:token', confirmAccount);

export default router;