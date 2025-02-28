const { Router } = require('express')
const usersController = require("../controllers/users")

usersRouter = Router()

usersRouter.post('/login', usersController.home)
usersRouter.psot('/register', usersController.cyclingIndex)



module.exports = usersRouter