const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

const generateJwt2 = (id, tg_user_id, role) => {
    return jwt.sign(
        {id, tg_user_id, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserContoller {

    async authentication(req, res, next) {
        const { tg_user_id, username, first_name, last_name, language, role } = req.body;
        if (!tg_user_id) {
            return next(ApiError.badRequest('Некорректный userId'));
        }
        
        // Преобразование tg_user_id в строку
        const tgUserIdStr = tg_user_id.toString();
        
        const candidate = await User.findOne({ where: { tg_user_id: tgUserIdStr } });
        if (candidate) {
            const token = generateJwt2(candidate.id, candidate.tg_user_id, candidate.role);
            return res.json({ token });
        }

        const user = await User.create({ tg_user_id: tgUserIdStr, username, first_name, last_name, language, role });
        await Basket.create({ userId: user.id });
        
        const token = generateJwt2(user.id, user.tg_user_id, user.role);
        return res.json({ token });
    }
    
    
    async registration(req,res) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password:hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt (user.id, user.email, user.role)
        return res.json({token})
    }

    async login (req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)  // сравниваем пароль, который указал пользователь с паролем из бд
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
           
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async check2(req, res, next) {
        const token = generateJwt2(req.user.id, req.user.tg_user_id, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserContoller()