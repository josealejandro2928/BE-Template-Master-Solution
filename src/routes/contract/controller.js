const { Contract } = require("./../../model");
const dtoContract = require("./dto");
const Op = require("sequelize").Op;

module.exports = {
    listOne: async (req, res, next) => {
        try {
            const { profile } = req;
            const { id } = req.params
            const contract = await Contract.findByPk(id);
            if (!contract) {
                throw { code: 404, message: `Contract with id=${id} does not exists` };
            }
            if (contract.ClientId != profile.id) {
                throw { code: 403, message: `You are not allow to access to contract with id=${id}` };
            }
            res.status(200).json(dtoContract.getContract(contract));
        } catch (error) {
            next(error);
        }

    },
    listAll: async (req, res, next) => {
        try {
            const { profile } = req;
            const allContracts = await Contract.findAll({
                where: {
                    [Op.or]: {
                        ClientId: profile.id,
                        ContractorId: profile.id
                    },
                    status: {
                        [Op.notIn]: ["terminated"]
                    }
                }
            })
            res.status(200).json(allContracts.map(dtoContract.getContract));
        } catch (error) {
            next(error);
        }

    }
}