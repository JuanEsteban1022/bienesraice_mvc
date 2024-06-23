import Propertie from './Propertie.model.js';
import Price from './Price.model.js';
import Categorie from './Categoria.model.js';
import User from './User.model.js';

// Price.hasOne(Propertie);

Propertie.belongsTo(Price, { foreignKey: 'priceId', as: 'precio' });
Propertie.belongsTo(Categorie, { foreignKey: 'categoryId', as: 'categoria' });
Propertie.belongsTo(User, { foreignKey: 'usuarioId' });

export {
    Categorie,
    Price,
    Propertie,
    User,
}