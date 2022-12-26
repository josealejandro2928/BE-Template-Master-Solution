const dtoContract = require("../contract/dto");
module.exports = {
    getJob: (job) => {
        const excludeFields = ["createdAt"];
        return Object.keys(job.dataValues ?? job).filter((key) => !excludeFields.includes(key)).reduce((acc, curr) => {
            if (curr == "Contract")
                acc[curr] = dtoContract.getContract(job[curr])
            else
                acc[curr] = job[curr];
            return acc;
        }, {})
    }
}