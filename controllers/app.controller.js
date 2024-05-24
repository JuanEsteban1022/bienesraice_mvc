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
        departamentos
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
        page: 'Categoria',
        properties,
    });
}

const notFound = (req, res) => {

}

const buscador = (req, res) => {

}

export {
    inicio, categoria, notFound, buscador
}