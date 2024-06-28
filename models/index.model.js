import Propertie from './Propertie.model.js';
import Price from './Price.model.js';
import Categorie from './Categoria.model.js';
import User from './User.model.js';
import Message from './mensaje.js';

// Price.hasOne(Propertie);

Propertie.belongsTo(Price, { foreignKey: 'priceId', as: 'precio' });
Propertie.belongsTo(Categorie, { foreignKey: 'categoryId', as: 'categoria' });
Propertie.belongsTo(User, { foreignKey: 'usuarioId' });
Propertie.hasMany(Message, { foreignKey: 'propertieId' });

Message.belongsTo(Propertie, { foreignKey: 'propertieId' });
Message.belongsTo(User, { foreignKey: 'usuarioId' });

export {
    Categorie,
    Price,
    Propertie,
    User,
    Message
}