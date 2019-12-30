const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth')
const UserController = require('../controllers/users')

router.get('/', UserController.users_get_all)

router.post('/signup', UserController.users_post_signup);

router.post('/login', UserController.users_post_login)

router.delete("/:userId", checkAuth, UserController.users_delete_one)

module.exports = router;