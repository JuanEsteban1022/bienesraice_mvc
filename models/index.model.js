import Propertie from './Propertie.model.js';
import Price from './Price.model.js';
import Categorie from './Categoria.model.js';
import User from './User.model.js';

// Price.hasOne(Propertie);

Propertie.belongsTo(Price);
Propertie.belongsTo(Categorie);
Propertie.belongsTo(User);

export {
    Categorie,
    Price,
    Propertie,
    User, 
}