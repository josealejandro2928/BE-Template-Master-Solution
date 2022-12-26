const { Job, Contract } = require("../../model");

module.exports = {
    getJob: async (req, res, next) => {
        // console.log("Here")
        let jobId = +(req.params.jobId || '0');
        let job = await Job.findByPk(jobId, { include: [{ model: Contract }] });
        if (!job) {
            return next({ code: 404, message: `There is not job with id=${jobId}` });
        }
        req.job = job
        next();
    }
}