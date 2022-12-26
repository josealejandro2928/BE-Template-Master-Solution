const Router = require("express").Router
const router = Router();

const { getProfile } = require('../../middleware/getProfile');
const BalanceController = require("./controller");

router.post('/deposit/:userId', getProfile, BalanceController.depositMoney);

module.exports = router;