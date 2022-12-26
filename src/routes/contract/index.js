const Router = require("express").Router
const router = Router();

const { getProfile } = require('../../middleware/getProfile');
const ContractController = require("./controller");

router.get('/:id', getProfile, ContractController.listOne);
router.get('/', getProfile, ContractController.listAll);

module.exports = router;