import nodemailer from 'nodemailer';

const emailRegister = async (datos) => {
    let transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    /** Envio de email */
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>

            <p>Tu cuenta ya esta lista, solo debes darle confirmar en el siguiente enlace: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmAccount/${token}">Confirmar Cuenta</a> </p>

            <p> Si tu no creaste esta cuenta, puedes ignorar el mensaje </p>
        `
    });
}

const forgotpassword = async (datos) => {
    let transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    /** Envio de email */
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu contraseña en BienesRaices.com',
        text: 'Reestablece tu contraseña en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, has solicitado tu contraseña en BienesRaices.com</p>

            <p>Sigue el siguiente enlace para generar una nueva contraseña: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgotpassword/${token}">Reestablecer Contraseña</a> </p>

            <p> Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje </p>
        `
    });
}

export {
    emailRegister,
    forgotpassword
}