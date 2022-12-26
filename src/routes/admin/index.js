const Router = require("express").Router
const router = Router();

const AdminController = require("./controller");

router.get('/best-profession', AdminController.bestProfession);
router.get('/best-clients', AdminController.bestClient);

module.exports = router;