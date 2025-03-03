const { Router } = require('express')
const statsController = require("../controllers/stats")
const authenticator = require("../middleware/authenticator");

statsRouter = Router()

statsRouter.get('/line-graph', authenticator, statsController.getStats)
statsRouter.get('/donut', authenticator, statsController.getDonut)

module.exports = statsRouter