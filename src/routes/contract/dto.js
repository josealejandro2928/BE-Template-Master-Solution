module.exports = {
    getContract: (contract) => {
        const excludeFields = ["createdAt"];
        return Object.keys(contract.dataValues ?? contract).filter((key) => !excludeFields.includes(key)).reduce((acc, curr) => {
            acc[curr] = contract[curr];
            return acc;
        }, {})
    }
}