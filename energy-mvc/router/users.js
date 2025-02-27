const { Router } = require('express')
const usersController = require("../controllers/users")
const authenticator = require("../middleware/authenticator");

usersRouter = Router()

usersRouter.post('/login', usersController.login)
usersRouter.post('/register', usersController.register)
usersRouter.get('/profile', authenticator, usersController.profile)


module.exports = usersRouter