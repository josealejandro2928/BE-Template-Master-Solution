const { getJobsToPay } = require("../../common");
const { Profile } = require("./../../model");

module.exports = {
    depositMoney: async (req, res, next) => {
        try {
            let { profile } = req;
            let { amount } = req.body;
            amount = +(amount || '0');
            let { userId } = req.params;
            let user = await Profile.findByPk(userId);
            if (isNaN(amount))
                throw { code: 400, message: `The amount to deposit is not a valid value, should be an integer` };

            if (!user)
                throw { code: 400, message: `The user does not exist with id =${userId}` };

            if (user.id != profile.id)
                throw { code: 403, message: `You cannot deposit money into the account of a different user than you` };

            const jobsToPay = await getJobsToPay(profile.id, null);
            const totalToPay = jobsToPay.reduce((acc, j) => acc + j.price, 0);
            if (totalToPay > 0) {
                let constraintValue = 0.25 * totalToPay;
                if (amount > constraintValue)
                    throw {
                        code: 400, message: `You only can add to your balance, an amount lower than 25% of the amount of  the unpaid job you have, should be lower than ${constraintValue.toFixed(2)}`
                    };
            }
            await Profile.update({ balance: amount + profile.balance }, { where: { id: profile.id } })
            profile = await Profile.findByPk(profile.id);
            res.status(201).json(profile);
        } catch (error) {
            next(error);
        }

    },

}