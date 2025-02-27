const { Router } = require('express')
const statsController = require("../controllers/stats")
const authenticator = require("../middleware/authenticator");

statsRouter = Router()

statsRouter.get('/', authenticator, statsController.getStats)

module.exports = statsRouter