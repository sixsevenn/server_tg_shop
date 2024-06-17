const CryptoJS = require('crypto-js');
const { URLSearchParams } = require('url');

const verifyTelegramWebAppData = async (telegramInitData) => {
    console.log("telegramIninData", telegramInitData);
    const initData = new URLSearchParams(telegramInitData);
    const hash = initData.get('hash');

    const userData = {
        query_id: initData.get("query_id"),
        user: JSON.parse(initData.get("user")),
        auth_date: initData.get("auth_date"),
    };
    console.log("userData", userData);
    let dataToCheck = [];

    initData.sort();
    initData.forEach(
        (val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`)
    );

    const secret = CryptoJS.HmacSHA256(process.env.TELEGRAM_API, "WebAppData");
    const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(
        CryptoJS.enc.Hex
    );

    const isVerify = _hash === hash;

    return { isVerify, userData };
};

const verifyTelegramInitData = async (req, res) => {
    try {
        // Извлекаем initData из тела запроса
        const { initData } = req.body;

        // Вызываем функцию верификации
        const { isVerify, userData } = await verifyTelegramWebAppData(initData);

        if (isVerify) {
            res.status(200).json({ ...userData });
        } else {
            res.status(403).json({ error: "Verification failed" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    verifyTelegramWebAppData,
    verifyTelegramInitData
};
