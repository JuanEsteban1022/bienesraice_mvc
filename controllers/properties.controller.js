import { Categorie, Price, Propertie } from '../models/index.model.js'
import { validationResult } from 'express-validator';


const admin = (req, res) => {
    res.render('properties/admin', {
        page: 'Mis propiedades',
    });
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

export {
    admin,
    crear,
    guardar,
    addImage,
    storeImage
}