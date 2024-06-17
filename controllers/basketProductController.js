const ApiError = require('../error/ApiError');
const { Basket, BasketProduct, Product, User } = require('../models/models');

class BasketProductController {
    // Добавить продукт в корзину
    async addProduct(req, res, next) {
        try {
            const { tgUserId, productId, quantity=1 } = req.body;
            
            const tgUserIdStr = tgUserId.toString();
            // Найти пользователя
            const user = await User.findOne({ where: { tg_user_id: tgUserIdStr } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
            
            // Найти корзину пользователя
            const basket = await Basket.findOne({ where: { userId: user.id } });

            if (!basket) {
                return next(ApiError.badRequest('Корзина пользователя не найдена'));
            }
            
            // Найти товар в корзине
            const existingProduct = await BasketProduct.findOne({
                where: { basket_id: basket.id, product_id: productId }
            });

            if (existingProduct) {
                // Если товар уже есть в корзине, увеличить количество
                existingProduct.quantity += quantity;
                await existingProduct.save();
                return res.json(existingProduct);
            } else {
                // Если товара еще нет в корзине, добавить его
                const basketProduct = await BasketProduct.create({
                    basket_id: basket.id,
                    product_id: productId,
                    quantity: quantity
                });
                return res.json(basketProduct);
            }

        } catch (error) {
            return next(ApiError.internal('Ошибка при добавлении товара в корзину'));
        }
    }

    // Удалить продукт из корзины
    async removeProduct(req, res, next) {
        try {
            const { tgUserId, productId, quantity, delete_all = false} = req.body;

            const tgUserIdStr = tgUserId.toString();

            // Найти пользователя
            const user = await User.findOne({ where: { tg_user_id: tgUserIdStr } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            // Найти корзину пользователя
            const basket = await Basket.findOne({ where: { userId: user.id } });
            if (!basket) {
                return next(ApiError.badRequest('Корзина пользователя не найдена'));
            }

            const basketProduct = await BasketProduct.findOne({
                where: { basket_id: basket.id, product_id: productId }
            });

            if (!basketProduct) {
                return next(ApiError.badRequest('Товар не найден в корзине'));
            }

            //Удаления одного товара из корзины полностью
            if (delete_all) {
                await basketProduct.destroy();
                return res.json({ message: 'Товар успешно полностью удален из корзины' });
            }
            
            // Уменьшить количество товара или удалить товар, если количество <= 0
            if (basketProduct.quantity > parseInt(quantity)) {
                basketProduct.quantity -= parseInt(quantity);
                await basketProduct.save();
                return res.json({ message: 'Количество товара успешно уменьшено в корзине' });

            } else {
                await basketProduct.destroy();
                return res.json({ message: 'Товар успешно удален из корзины' });
            }

        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении товара из корзины'));
        }
    }


    async removeAllProducts(req, res, next) {
        try {
            const { tgUserId } = req.body;
    
            if (!tgUserId) {
                return next(ApiError.badRequest('tgUserId не предоставлен'));
            }
    
            const tgUserIdStr = tgUserId.toString();
    
            // Найти пользователя
            const user = await User.findOne({ where: { tg_user_id: tgUserIdStr } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
    
            // Найти корзину пользователя
            const basket = await Basket.findOne({ where: { userId: user.id } });
            if (!basket) {
                return next(ApiError.badRequest('Корзина пользователя не найдена'));
            }
    
            // Удалить все товары из корзины
            await BasketProduct.destroy({ where: { basket_id: basket.id } });
    
            return res.json({ message: 'Все товары успешно удалены из корзины' });
        } catch (error) {
            console.error('Ошибка при удалении всех товаров из корзины:', error);
            return next(ApiError.internal('Ошибка при удалении всех товаров из корзины'));
        }
    }
    
    

    async getAll(req, res, next) {
        try {
            const { tgUserId } = req.query;

            if (!tgUserId) {
                return next(ApiError.badRequest('tgUserId не предоставлен'));
            }

            const tgUserIdStr = tgUserId.toString();

            // Найти пользователя
            const user = await User.findOne({ where: {tg_user_id: tgUserIdStr } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            // Найти корзину пользователя
            const basket = await Basket.findOne({ where: { userId: user.id } });
            if (!basket) {
                return next(ApiError.badRequest('Корзина пользователя не найдена'));
            }

            // Все товары из корзины пользователя
            const products = await BasketProduct.findAll({ where: { basket_id: basket.id } });

            return res.json(products);
        } catch (error) {
            console.error('Ошибка при получении товаров из корзины:', error);
            return next(ApiError.internal('Ошибка при получении товаров из корзины'));
        }
    }


    async getWithProducts(req, res, next) {
        try {
            const { tgUserId } = req.query;

            if (!tgUserId) {
                return next(ApiError.badRequest('tgUserId не предоставлен'));
            }

            const tgUserIdStr = tgUserId.toString();

            // Найти пользователя
            const user = await User.findOne({ where: {tg_user_id: tgUserIdStr } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            // Найти корзину пользователя
            const basket = await Basket.findOne({ where: { userId: user.id } });
            if (!basket) {
                return next(ApiError.badRequest('Корзина пользователя не найдена'));
            }

            // Все товары из корзины пользователя вместе с информацией о продукте
            const products = await BasketProduct.findAll({
                where: { basket_id: basket.id },
                include: {
                    model: Product,
                    attributes: ['id', 'name', 'description', 'price', 'weight', 'img', 'nutritional_value'],
                },
            });

            return res.json(products);
        } catch (error) {
            console.error('Ошибка при получении товаров из корзины:', error);
            return next(ApiError.internal('Ошибка при получении товаров из корзины'));
        }
    }
    
    
}


module.exports = new BasketProductController();
