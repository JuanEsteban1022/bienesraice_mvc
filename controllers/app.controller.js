import { Sequelize } from "sequelize";
import { Price, Categorie, Propertie, User } from "../models/index.model.js";

const inicio = async (req, res) => {

    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categorie.findAll({ raw: true }),
        Price.findAll({ raw: true }),
        Propertie.findAll({
            limit: 3,
            where: { categoryId: 1 },
            include: [{ model: Price, as: 'precio' }],
            order: [['createdAt', 'DESC']]
        }),
        Propertie.findAll({
            limit: 3,
            where: { categoryId: 2 },
            include: [{ model: Price, as: 'precio' }],
            order: [['createdAt', 'DESC']]
        }),
    ]);

    res.render('inicio', {
        page: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken()
    });
}

const categoria = async (req, res) => {
    const { id } = req.params;

    // Comprobar que la categoria existe
    const categoria = await Categorie.findByPk(id);

    if (!categoria) {
        return res.redirect('/404');
    }
    // Obtener propiedades de la categoria
    const properties = await Propertie.findAll({
        where: { categoryId: id },
        include: [{ model: Price, as: 'precio' }]
    });

    res.render('categoria', {
        page: `${categoria.name}s en Venta`,
        properties,
        csrfToken: req.csrfToken()
    });
}

const notFound = (req, res) => {
    res.render('404', {
        page: 'No Encontrada',
        csrfToken: req.csrfToken()
    });
}

const buscador = async (req, res) => {

    const { termino } = req.body;

    console.log('validar termino: ', !termino.trim());

    // Validar que termino no este vacio
    if (!termino.trim()) {
        return res.redirect('back');
    }

    // Consultar las propiedades
    const properties = await Propertie.findAll({
        where: {
            title: {
                [Sequelize.Op.like]: '%' + termino + '%'
            }
        },
        include: [
            { model: Price, as: 'precio' }
        ]
    });

    res.render('busqueda', {
        page: 'Resultados de la búsqueda',
        properties,
        csrfToken: req.csrfToken()
    });

    console.log(properties);

}

export {
    inicio, categoria, notFound, buscador
}