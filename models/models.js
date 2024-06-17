const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    tg_user_id: {type: DataTypes.STRING, unique: true},
    username: {type: DataTypes.STRING},
    first_name: {type: DataTypes.STRING},
    last_name: {type: DataTypes.STRING},
    language: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    quantityOfProducts: {type: DataTypes.INTEGER},
    totalPrice: {type: DataTypes.INTEGER},
})

const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
    // basket_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'baskets', key: 'id' } },
    // product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    weight: {type: DataTypes.INTEGER, allowNull: false}, 
    img: {type: DataTypes.STRING, allowNull: false},
    nutritional_value: {type: DataTypes.STRING, allowNull: false},
})

// склад
// продукт
// количество на складе


// заказ 
// продукты и их колво
// инфо о клиенте
 

// доставка
// связана с пользователем и с заказом
// адресс

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,allowNull: false},
})


User.hasOne(Basket)
Basket.belongsTo(User, { foreignKey: 'userId' })

Basket.hasMany(BasketProduct, { foreignKey: 'basket_id' })
BasketProduct.belongsTo(Basket, { foreignKey: 'basket_id' })

Type.hasMany(Product)
Product.belongsTo(Type)

Product.hasMany(BasketProduct, { foreignKey: 'product_id' })
BasketProduct.belongsTo(Product, { foreignKey: 'product_id' })


module.exports = {
    User, 
    Basket,
    BasketProduct,
    Product,
    Type,
}
// при изменениях запустить 
// sequelize.sync({ alter: true }).then(() => {  
//     console.log("Все таблицы были успешно обновлены");
// });