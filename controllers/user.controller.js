import { check, validationResult } from 'express-validator';
import bcrypt from "bcrypt";

import { emailRegister, forgotpassword } from "../helpers/emails.js";
import { generateId, generateJWT } from "../helpers/tokens.js";
import Usuario from '../models/User.model.js'

const formLogin = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    });
};

const authenticate = async (req, res) => {
    /** Validación */
    await check('email').isEmail().withMessage('El email es obligatorio.').run(req);
    await check('password').notEmpty().withMessage('La contraseña es obligatoria.').run(req);

    let resultado = validationResult(req);

    /** Verificación de resultado vacio */
    if (!resultado.isEmpty()) {
        // Error
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errors: resultado.array(),
        });
    }

    const { email, password } = req.body;

    /** Comprobación de usuario */
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'El usuario no existe.' }],
        });
    }

    /** Validar si el usuario esta confirmado */
    if (!user.confirmado) {
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'La cuenta no esta confirmado.' }],
        });
    }

    /** Validar contraseña */
    if (!user.validatePassword(password)) {
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'La constraseña es incorrecta.' }],
        });
    }

    /** Autenticar al usuario */
    console.log(user.id);
    const token = generateJWT({ id: user.id, nombre: user.nombre });

    /** Almacenar token en cookie */
    return res.cookie('_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: true
    }).redirect('/my-properties');
};

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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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

const formForgotPassword = (req, res) => {
    res.render('auth/forgotpassword', {
        page: 'Recuperar contraseña',
        csrfToken: req.csrfToken(),
    });
};

const resetPassword = async (req, res) => {
    /** Validación */
    await check('email').isEmail().withMessage('El email no contiene un formato invalido.').run(req);

    let resultado = validationResult(req);

    /** Verificación de resultado vacio */
    if (!resultado.isEmpty()) {
        // Error
        return res.render('auth/forgotpassword', {
            page: 'Recuperar acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errors: resultado.array()
        });
    }

    /** Buscar usuario */
    const { email } = req.body;

    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
        // Error
        return res.render('auth/forgotpassword', {
            page: 'Recuperando acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'El correo no pertenece a ningún usuario' }]
        });
    }

    /** Generar token y enviar email */
    user.token = generateId();
    await user.save();

    /** Enviar email */
    forgotpassword({
        email,
        nombre: user.nombre,
        token: user.token
    });

    /** Renderizar mensaje */
    res.render('templates/mensaje', {
        page: 'Recuperando acceso a Bienes Raices',
        msg: 'Hemos enviado un email con las instrucciones',
    });
};

/** Validación de tokens */
const validToken = async (req, res, next) => {

    const { token } = req.params;

    const user = await Usuario.findOne({ where: { token } });

    if (!user) {
        return res.render('auth/confirmAccount', {
            page: 'Reestablece tu constraseña!!',
            message: 'Hubo un error al validar tu cuenta, intenta de nuevo.',
            error: true
        });
    }

    /** Mostrar formulario para modificar contraseña */
    res.render('auth/resetPassword', {
        page: 'Reestablece tu constraseña',
        csrfToken: req.csrfToken()
    });

}
const newPassword = async (req, res) => {
    /** Validar password */
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres.').run(req);

    let resultado = validationResult(req);

    /** Verificación de resultado vacio */
    if (!resultado.isEmpty()) {
        // Error
        return res.render('auth/resetPassword', {
            page: 'Reestablece tu contraseña',
            csrfToken: req.csrfToken(),
            errors: resultado.array(),
        });
    }

    const { token } = req.params;
    const { password } = req.body;
    /** Identificar quien hace el cambio */
    const user = await Usuario.findOne({ where: { token } });

    /** Hashear nuevo password */
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.token = null;

    await user.save();

    res.render('auth/confirmAccount', {
        page: 'Contraseña reestablecida!!',
        message: 'La contraseña se guardo correctamente'
    });
}

export {
    authenticate,
    confirmAccount,
    formForgotPassword,
    formLogin,
    formRegister,
    newPassword,
    register,
    resetPassword,
    validToken,
}
