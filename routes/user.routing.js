import express from "express";
import {
    authenticate,
    confirmAccount,
    formForgotPassword,
    formLogin,
    formRegister,
    register,
    resetPassword,
    validToken, newPassword
} from "../controllers/user.controller.js";

const router = express.Router();

// Routing
router.get('/login', formLogin);
router.post('/login', authenticate);

router.get('/register', formRegister);
router.post('/register', register);

router.get('/forgotpassword', formForgotPassword);
router.post('/forgotpassword', resetPassword);

router.get('/confirmAccount/:token', confirmAccount);

/** Almacena el nuevo password */
router.get('/forgotpassword/:token', validToken);
router.post('/forgotpassword/:token', newPassword);


export default router;