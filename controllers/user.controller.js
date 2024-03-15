import { check, validationResult } from 'express-validator';
import { emailRegister } from "../helpers/emails.js";
import { generateId } from "../helpers/tokens.js";
import Usuario from '../models/User.js'

const formLogin = (req, res) => { res.render('auth/login', { page: 'Iniciar Sesión' }); };

const formRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Crear cuenta',
        csrfToken: req.csrfToken()
    });
};

const register = async (req, res) => {
    /** Validación */
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio.').run(req);
    await check('email').isEmail().withMessage('El email se encuentra vacio o no contiene un formato invalido.').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres.').run(req);
    await check('rep_password').equals(req.body.password).withMessage('Las contraseñas no coinciden.').run(req);

    let resultado = validationResult(req);

    /** Verificación de resultado vacio */
    if (!resultado.isEmpty()) {
        // Error
        return res.render('auth/register', {
            page: 'Crear cuenta',
            errors: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        });
    }

    /** Extración de datos */
    const { nombre, email, password } = req.body


    /** Verificar que si el usuario existe */
    const userExistent = await Usuario.findOne({ where: { email } });

    if (userExistent) {
        return res.render('auth/register', {
            page: 'Crear cuenta',
            errors: [{ msg: 'El usuario ya esta registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        });
    }

    /** Creación de usuario */
    const user = await Usuario.create({
        nombre,
        email,
        password,
        token: generateId()
    });

    /** Envio de email de confirmación */
    emailRegister({
        nombre: user.nombre,
        email: user.email,
        token: user.token

    });

    /** Visualización de mensaje de confirmación */
    res.render('templates/mensaje', {
        page: 'Cuenta creada exitosamente!!',
        message: 'Hemos enviado un email de confirmación, presiona en el enlace.'
    })
};

const confirmAccount = async (req, res, next) => {
    const { token } = req.params;

    console.log('token: ', token);

    /** Verificar si el token es válido */
    const user = await Usuario.findOne({ where: { token } });

    if (!user) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu cuenta!!',
            message: 'Hubo un error al confirmar tu cuenta, intenta de nuevo.',
            error: true
        });
    }

    /** Confirmación de la cuenta */
    user.token = null;
    user.confirmado = true;

    await user.save(user);

    return res.render('auth/confirmAccount', {
        page: 'Cuenta confirmada!!',
        message: 'La cuenta se confirmo correctamente.',
        error: false
    });
}

const formForgotPassword = (req, res) => { res.render('auth/forgotpassword', { page: 'Recuperar contraseña' }); };

export {
    confirmAccount,
    formForgotPassword,
    formLogin,
    formRegister,
    register,
}
