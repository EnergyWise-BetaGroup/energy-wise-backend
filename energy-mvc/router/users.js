const { Router } = require('express')
const usersController = require("../controllers/users")

usersRouter = Router()

usersRouter.post('/login', usersController.login)
usersRouter.post('/register', usersController.register)


module.exports = usersRouter