import Precio from '../models/price.model.js';
import { validationResult } from 'express-validator';
import Categoria from '../models/Categoria.model.js';


const admin = (req, res) => {
    res.render('properties/admin', {
        page: 'Mis propiedades',
        bar: true
    });
}

const crear = async (req, res) => {

    // Consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('properties/create', {
        page: 'Crear propiedad',
        bar: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios
    });
}

const guardar = async (req, res) => {

    // Validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {

        // Consultar modelo de precios y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('properties/create', {
            page: 'Crear propiedad',
            bar: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errors: resultado.array()
        });
    }
}

export {
    admin,
    crear,
    guardar
}