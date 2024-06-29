import express from "express";
import {
    authenticate,
    cerrarSesion,
    confirmAccount,
    formForgotPassword,
    formLogin,
    formRegister,
    newPassword,
    register,
    resetPassword,
    validToken, 
} from "../controllers/user.controller.js";

const router = express.Router();

// Routing
router.get('/login', formLogin);
router.post('/login', authenticate);

// Cerrar Sesión
router.post('/cerrar-sesion', cerrarSesion);

router.get('/register', formRegister);
router.post('/register', register);

router.get('/forgotpassword', formForgotPassword);
router.post('/forgotpassword', resetPassword);

router.get('/confirmAccount/:token', confirmAccount);

/** Almacena el nuevo password */
router.get('/forgotpassword/:token', validToken);
router.post('/forgotpassword/:token', newPassword);


export default router;