import express from 'express';
import usuerioRoutes from "./routes/user.routing.js";
import db from "./config/db.js";

const app = express();
const port = 3000;

// Conexión a la DB
try {
    await db.authenticate();
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
app.use('/auth', usuerioRoutes);


// Definición de puerto y arranque del proyecto
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});