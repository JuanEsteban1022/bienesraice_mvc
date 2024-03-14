const formLogin = (req, res) => { res.render('auth/login', { page: 'Iniciar Sesión' }); };

const formRegister = (req, res) => { res.render('auth/register', { page: 'Crear cuenta' }); };

const register = (req, res) => { console.log('registrando'); };

const formForgotPassword = (req, res) => { res.render('auth/forgotpassword', { page: 'Recuperar contraseña' }); };

export {
    formLogin,
    formRegister,
    formForgotPassword,
    register
}