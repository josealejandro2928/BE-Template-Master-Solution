const { Contract, Job, Profile, sequelize, } = require("./../../model");
const moment = require("moment")
const Op = require("sequelize").Op;

module.exports = {
    bestProfession: async (req, res, next) => {
        try {
            let { start, end } = req.query;
            if (!start || !moment(start).isValid()) {
                start = moment().startOf("day").toDate();
            } else {
                start = moment(start).startOf("day").toDate();
            }

            if (!end || !moment(end).isValid()) {
                end = moment(start).add(1, "day").endOf("day").toDate();
            } else {
                end = moment(end).endOf("day").toDate();
            }

            const jobs = await Job.findAll({
                where: {
                    paid: 1,
                    paymentDate: {
                        [Op.between]: [start, end]
                    }
                },
                include: [{ model: Contract, include: [{ model: Profile, as: "Contractor" }] }]
            });

            let data = jobs.reduce((acc, curr) => {
                let profession = curr?.Contract?.Contractor?.profession
                if (profession in acc) {
                    acc[profession] += curr.price;
                } else {
                    acc[profession] = curr.price;
                }
                return acc;
            }, {})

            let array = Object.keys(data).map((key) => [key, data[key]])
            array.sort((a, b) => b[1] - a[1]);
            if (array.length) {
                res.status(200).json({ data, bestProfession: array[0][0] });
            } else {
                res.status(200).json({ bestProfession: "There is not data in that range dates" });
            }

        } catch (error) {
            next(error);
        }

    },
    bestClient: async (req, res, next) => {
        try {
            let { start, end, limit } = req.query;
            if (!start || !moment(start).isValid()) {
                start = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
            } else {
                start = moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss");
            }

            if (!end || !moment(end).isValid()) {
                end = moment(start).add(1, "day").endOf("day").format("YYYY-MM-DD HH:mm:ss");
            } else {
                end = moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss");
            }
            limit = +(limit || 2)


            // eslint-disable-next-line no-unused-vars
            const [results, _] = await sequelize.query(`
            select
                p.id ,
                p.firstName || ' ' || p.lastName  AS fullName,
                (
                    SELECT
                        SUM(j.price)
                    from
                        Jobs j
                    inner join Contracts c on
                        (c.id == j.ContractId)
                    where
                        j.paid = 1 and 
                        c.ClientId = p.id and 
                        j.paymentDate BETWEEN '${start}' AND '${end}'
                ) as paid
            from
                Profiles p
            where
                paid >= 0
            ORDER BY paid DESC
            LIMIT ${limit};`)
            
            res.json(results);
        } catch (error) {
            next(error);
        }

    },
}