import cookieParser from "cookie-parser";
import csrf from "csurf";
import db from "./config/db.js";
import express from 'express';
import usuerioRoutes from "./routes/user.routing.js";
import propiedadesRoutes from "./routes/properties.routing.js";
import appRoutes from "./routes/app-routes.routing.js";
import apiRoutes from "./routes/api-routes.routing.js";

const app = express();
const port = process.env.PORT || 3000;

/**
 * habilitación de lectura de datos de formularios
 */
app.use(express.urlencoded({ extended: true }));

/** Habilitar cookie parser */
app.use(cookieParser());

/** Habilitar CSRF */
app.use(csrf({ cookie: true }));

// Conexión a la DB
try {
    await db.authenticate();
    db.sync();
    console.log('Conexión correcta a la DB');
} catch (error) {
    console.error(error);
}

// habilitación de Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta publica
app.use(express.static('public'));

// use busca las rutas que inician con /
app.use('/', appRoutes);
app.use('/auth', usuerioRoutes);
app.use('/', propiedadesRoutes);
app.use('/api', apiRoutes);


// Definición de puerto y arranque del proyecto
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});