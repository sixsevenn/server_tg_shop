const ApiError = require('../error/ApiError');
const { Basket, BasketProduct, Product, User } = require('../models/models');

// const findBasketByTgUserId (tgUserId) {

//     if (!tgUserId) {
//         return next(ApiError.badRequest('tgUserId не предоставлен'));
//     }

//     const tgUserIdStr = tgUserId.toString();

//     // Найти пользователя
//     const user = await User.findOne({ where: {tg_user_id: tgUserIdStr } });
//     if (!user) {
//         return next(ApiError.badRequest('Пользователь не найден'));
//     }

//     // Найти корзину пользователя
//     const basket = await Basket.findOne({ where: { userId: user.id } });
//     if (!basket) {
//         return next(ApiError.badRequest('Корзина пользователя не найдена'));
//     }
//     return basket;
// }

class BasketController {

    // GET
    async getTotalPrice(req, res, next) {
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

            // Найти все продукты в корзине
            const basketProducts = await BasketProduct.findAll({
                where: { basket_id: basket.id },
                include: Product // Включить информацию о продукте
            });

            // Вычислить общую цену на основе продуктов в корзине
            let totalPrice = 0;
            for (let product of basketProducts) {
                totalPrice += product.quantity * product.product.price;
            }

            // Обновить общую цену в корзине
            basket.totalPrice = totalPrice;
            await basket.save();

            return res.json({ totalPrice }); // Ответ с общей ценой
        } catch (error) {
            console.error('Ошибка при получении общей цены:', error);
            return next(ApiError.internal('Ошибка при получении общей цены'));
        }
    }

    async getTotalQuantity(req, res, next) {
        try {
            // Логика получения общего количества
            return res.json({ totalQuantity: 5 }); // Пример ответа с общим количеством
        } catch (error) {
            console.error('Ошибка при получении общего количества:', error);
            return next(ApiError.internal('Ошибка при получении общего количества'));
        }
    }

    
    // POST
    async updateTotalPrice(req, res, next) {
        try {
            // Логика обновления общей цены
            return res.json({ message: 'Общая цена обновлена' });
        } catch (error) {
            console.error('Ошибка при обновлении общей цены:', error);
            return next(ApiError.internal('Ошибка при обновлении общей цены'));
        }
    }

    async updateTotalQuantity(req, res, next) {
        try {
            // Логика обновления общего количества
            return res.json({ message: 'Общее количество обновлено' });
        } catch (error) {
            console.error('Ошибка при обновлении общего количества:', error);
            return next(ApiError.internal('Ошибка при обновлении общего количества'));
        }
    }



    
}

module.exports = new BasketController();