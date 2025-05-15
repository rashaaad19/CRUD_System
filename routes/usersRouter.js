const Router = require('express');
const userController = require('../controllers/usersController');
const restrictTo = require('../middleware/restrictTo');
const auth = require('../middleware/auth');

const router = Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login)
router.get("/", auth, restrictTo('admin'), userController.getAllUsers)
module.exports = router;