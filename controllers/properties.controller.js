import { Categorie, Price, Propertie } from '../models/index.model.js'
import { validationResult } from 'express-validator';
import { unlink } from "node:fs/promises";
import { isVendedor } from "../helpers/index.js";


const admin = async (req, res) => {

    // Leer QueryString

    const { page: actualPage } = req.query;

    /** Fabricación de expresión regular */
    const expressionRegular = /^[1-9]$/;

    /** Valida que la pagina actual cumpla con las condiciones de la expresión regular */
    if (!expressionRegular.test(actualPage)) {
        return res.redirect('/my-properties?page=1');
    }

    try {
        const { id } = req.user;

        // Limites y Offset para el paginador
        const limit = 5;

        const offset = ((actualPage * limit) - limit);

        const [properties, total] = await Promise.all([
            Propertie.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                    { model: Categorie, as: 'categoria' },
                    { model: Price, as: 'precio' }
                ]
            }),
            Propertie.count({
                where: {
                    usuarioId: id
                }
            }),
        ]);

        res.render('properties/admin', {
            page: 'Mis propiedades',
            csrfToken: req.csrfToken(),
            properties,
            pages: Math.ceil(total / limit),
            actualPage: Number(actualPage),
            total,
            offset,
            limit,
        });
    } catch (error) {
        console.log(error);
    }
}

const crear = async (req, res) => {

    // Consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categorie.findAll(),
        Price.findAll()
    ]);

    res.render('properties/create', {
        page: 'Crear propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    });
}

const guardar = async (req, res) => {

    // Validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {

        // Consultar modelo de precios y categorias
        const [categorias, precios] = await Promise.all([
            Categorie.findAll(),
            Price.findAll()
        ]);

        return res.render('properties/create', {
            page: 'Crear propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errors: resultado.array(),
            datos: req.body
        });
    }

    // Crear registro
    const { titulo: title, descripcion: description, categoria: categoryId, precio: priceId, habitaciones, estacionamiento, banos, calle, lat, lng } = req.body;

    const { id: usuarioId } = req.user;

    try {
        const propiedadAlmacenada = await Propertie.create({
            banos,
            calle,
            categoryId,
            description,
            estacionamiento,
            habitaciones,
            lat,
            lng,
            priceId,
            title,
            usuarioId,
            imagen: ''
        });

        const { id } = propiedadAlmacenada;

        res.redirect(`/properties/add-image/${id}`);

    } catch (error) {
        console.error(error);
    }
}

const addImage = async (req, res) => {

    const { id } = req.params;
    // Validar existencia de la propiedad
    const propertie = await Propertie.findByPk(id);

    if (!propertie) {
        return res.redirect('/my-properties');
    }

    // Validad que la propiedad no se encuentre publicada
    if (propertie.publicado) {
        return res.redirect('/my-properties');
    }

    // Validad que la propiedad pertenezca al usuario logueado
    if (req.user.id.toString() !== propertie.usuarioId.toString()) {
        return res.redirect('/my-properties');
    }

    res.render('properties/add-image', {
        page: `Agregar Imagen: ${propertie.title}`,
        csrfToken: req.csrfToken(),
        propertie
    });
}

const storeImage = async (req, res, next) => {

    const { id } = req.params;

    // Valida que la propiedad exista
    const propertie = await Propertie.findByPk(id);

    if (!propertie) {
        return res.redirect('/my-properties');
    }


    // Validad que la propiedad no se encuentre publicada
    if (propertie.publicado) {
        return res.redirect('/my-properties');
    }

    // Validad que la propiedad pertenezca al usuario logueado
    if (req.user.id.toString() !== propertie.usuarioId.toString()) {
        return res.redirect('/my-properties');
    }
    try {

        /** Almacenar la imagen y publicar propiedad */
        propertie.imagen = req.file.filename;
        propertie.publicado = 1;

        await propertie.save();

        // Permite que continue al siguiente middleware
        next();

    } catch (error) {
        console.log(error);
    }
}

const editar = async (req, res) => {

    const { id } = req.params;

    // Validar que la propiedad exista
    const propertie = await Propertie.findByPk(id);

    if (!propertie) {
        return res.redirect('/my-properties');
    }

    // Revisar que quien visita la URL es quien publico la propiedad
    if (propertie.usuarioId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties');
    }

    // Consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categorie.findAll(),
        Price.findAll()
    ]);

    res.render('properties/edit', {
        page: `Editar propiedad: ${propertie.title}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propertie
    });
}

const guardarCambios = async (req, res) => {

    // Validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {

        // Consultar modelo de precios y categorias
        const [categorias, precios] = await Promise.all([
            Categorie.findAll(),
            Price.findAll()
        ]);

        return res.render('properties/edit', {
            page: 'Editar propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errors: resultado.array(),
            datos: req.body
        });
    }

    const { id } = req.params;

    // Validar que la propiedad exista
    const propertie = await Propertie.findByPk(id);

    if (!propertie) {
        return res.redirect('/my-properties');
    }

    // Revisar que quien visita la URL es quien publico la propiedad
    if (propertie.usuarioId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties');
    }

    // Reescribir objeto y actualizar
    try {
        const { titulo: title, descripcion: description, categoria: categoryId, precio: priceId, habitaciones, estacionamiento, banos, calle, lat, lng } = req.body;

        propertie.set({
            banos,
            calle,
            categoryId,
            description,
            estacionamiento,
            habitaciones,
            lat,
            lng,
            priceId,
            title,
        });

        await propertie.save();
        res.redirect('my-properties');

    } catch (error) {
        console.log(error);
    }

}

const deletePropertie = async (req, res) => {
    const { id } = req.params;

    // Validar que la propiedad exista
    const propertie = await Propertie.findByPk(id);

    if (!propertie) {
        return res.redirect('/my-properties');
    }

    // Revisar que quien visita la URL es quien publico la propiedad
    if (propertie.usuarioId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties');
    }

    // Eliminar imagen asociada
    await unlink(`public/uploads/${propertie.imagen}`);

    // Eliminar la propiedad
    await propertie.destroy();
    res.redirect('/my-properties');
}

/** Visualización de propiedad */
const viewPropertie = async (req, res) => {

    const { id } = req.params;

    console.log('request del usuario: ', req.user);

    // Validar que la propiedad existe
    const propertie = await Propertie.findByPk(id, {
        include: [
            { model: Categorie, as: 'categoria' },
            { model: Price, as: 'precio' }
        ]
    });

    if (!propertie) {
        return res.redirect('/404');
    }

    res.render('properties/view-properties', {
        propertie,
        page: propertie.title,
        csrfToken: req.csrfToken(),
        usuario: req.user,
        isVendedor: isVendedor(req.user?.id, propertie.usuarioId)
    });
}

export {
    addImage,
    admin,
    crear,
    deletePropertie,
    editar,
    guardar,
    guardarCambios,
    storeImage,
    viewPropertie,
}