import jwt from "jsonwebtoken";
import Usuario from '../models/User.model.js'
const protectRoute = async (req, res, next) => {

    // Verificar si existe un token
    const { _token } = req.cookies;

    if (!_token) {
        return res.redirect('/auth/login');
    }

    // Comprobar token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const user = await Usuario.scope('deletePassword').findByPk(decoded.id);

        // Almacenar usuario en el request
        if (user) {
            req.user = user;
        } else {
            return res.redirect('/auth/login');
        }

        return next();

    } catch (error) {
        return res.clearCookie('_token').redirect('auth/login');
    }
}

export default protectRoute;