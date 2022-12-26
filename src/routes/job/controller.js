const { getJobsToPay } = require("../../common");
const { Job, sequelize, Profile } = require("./../../model");
const dtoJob = require("./dto");
const Op = require("sequelize").Op;

module.exports = {
    listUnpaid: async (req, res, next) => {
        try {
            const { profile } = req;
            const jobs = await getJobsToPay(profile.id, null);
            res.status(200).json(jobs.map(dtoJob.getJob));
        } catch (error) {
            next(error);
        }

    },
    payJob: async (req, res, next) => {
        try {
            let { profile, job } = req;
            if (job.paid)
                throw { code: 400, message: `The job with the id=${job.id} is already paid` };

            if (profile.type != "client")
                throw { code: 403, message: `Only clients can perform this action` };

            if (profile.id != job?.Contract?.ClientId)
                throw { code: 403, message: `You are not allowed to perform this action` };

            if (job.price > profile.balance)
                throw { code: 403, message: `You do not have enough balance` };

            if (job?.Contract?.status != "in_progress")
                throw { code: 404, message: `You can only pay for contract in progress` };

            await sequelize.transaction(async (t) => {
                await Promise.all([
                    Profile.update({ balance: profile.balance - job.price }, {
                        where: {
                            id: profile.id
                        },
                        transaction: t,
                        lock: {
                            level: t.LOCK.UPDATE,
                            of: Profile
                        }
                    }),
                    Job.update({ paid: 1, paymentDate: new Date() }, { where: { id: job.id }, transaction: t })
                ])

                let jobsUnpaidPerContract = await Job.findAll({
                    where: {
                        id: job.Contract.id,
                        [Op.or]: [{
                            paid: {
                                [Op.not]: 1
                            },
                        }, {
                            paid: {
                                [Op.eq]: null
                            }
                        }]
                    }, transaction: t
                })
                if (!jobsUnpaidPerContract.length) {
                    await job.Contract.update({ "status": "terminated" }, { transaction: t });
                }
            })

            job = await Job.findByPk(job.id);
            res.status(201).json(dtoJob.getJob(job));
        } catch (error) {
            next(error);
        }

    },
}