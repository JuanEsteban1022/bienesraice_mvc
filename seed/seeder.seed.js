import categoria from './../models/Categoria.model.js';
import categories from "./categories.seed.js";
import db from '../config/db.js';
import precio from './../models/Price.model.js';
import price from "./price.seed.js";

const importarDatos = async () => {
    try {
        // Autenticar
        await db.authenticate()

        // Generar columnas
        await db.sync();

        // Insertar datos
        await Promise.all([
            await categoria.bulkCreate(categories),
            await precio.bulkCreate(price),
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
        // await Promise.all([
        //     await categoria.truncate({ where: {}, truncate: true }),
        //     await precio.truncate({ where: {}, truncate: true }),
        // ]);
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
