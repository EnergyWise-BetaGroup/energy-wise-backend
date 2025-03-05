const { Router } = require('express')
const statsController = require("../controllers/stats")
const authenticator = require("../middleware/authenticator");

statsRouter = Router()

statsRouter.get('/line-graph', authenticator, statsController.getStats)
statsRouter.get('/donut', authenticator, statsController.getDonut)
statsRouter.get('/gauge', authenticator, statsController.getGauge)
statsRouter.get('/table', authenticator, statsController.getTable)

module.exports = statsRouter