const { Job, Contract } = require("./model")
const Op = require("sequelize").Op;

// eslint-disable-next-line no-unused-vars
async function errorHandler(error, req, res, next) {
    let errors = [{ "message": error.message }];
    if (error.errors && Array.isArray(error.errors)) {
        errors = [...errors, ...error.errors.map(x => ({ "message": x.message || "Error !!" }))]
    }
    return res.status(error.status || error.code || 500).json(errors);
}

async function getJobsToPay(profileId, transaction = null) {
    return Job.findAll({
        where: {
            [Op.or]: [{
                paid: {
                    [Op.not]: 1
                },
            }, {
                paid: {
                    [Op.eq]: null
                }
            }]
        },
        include: [
            {
                model: Contract,
                where: {
                    [Op.or]: {
                        ClientId: profileId,
                        ContractorId: profileId
                    },
                    status: "in_progress"
                }
            }
        ],
        transaction
    })

}

module.exports = {
    errorHandler,
    getJobsToPay
}