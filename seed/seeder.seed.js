import categories from "./categories.seed.js";
import db from '../config/db.js';
import price from "./price.seed.js";
import usuarios from "./users.seed.js";
import { Categorie, Price, User } from "../models/index.model.js";

const importarDatos = async () => {
    try {
        // Autenticar
        await db.authenticate()

        // Generar columnas
        await db.sync();

        // Insertar datos
        await Promise.all([
            await Categorie.bulkCreate(categories),
            await Price.bulkCreate(price),
            await User.bulkCreate(usuarios),
        ]);
        console.log('Datos importados correctamente');
        process.exit(0);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const deleteData = async () => {
    try {
        /**
         * await Promise.all([
           await Categorie.truncate({ where: {}, truncate: true }),
           await Price.truncate({ where: {}, truncate: true }),
         ]);
         *  */
        await db.sync({ force: true });

        console.log('Datos eliminados correctamente');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    deleteData();
}
