const Router = require("express").Router
const router = Router();

const { getProfile } = require('../../middleware/getProfile');
const { getJob } = require("./middleware");
const JobController = require("./controller");

router.get('/unpaid', getProfile, JobController.listUnpaid);
router.post('/:jobId/pay', getProfile, getJob, JobController.payJob);

module.exports = router;