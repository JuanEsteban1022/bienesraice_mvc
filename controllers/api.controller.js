import { Propertie, Price, Categorie } from "../models/index.model.js";

const properties = async (req, res) => {

    const propertie = await Propertie.findAll({
        include: [
            {model: Price, as: 'precio'},
            {model: Categorie, as: 'categoria'},
        ]
    });

    res.json(propertie);
}

export {
    properties
}