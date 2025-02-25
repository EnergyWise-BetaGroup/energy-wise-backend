const { Router } = require('express')
const tourDeFranceController = require("../controllers/tourDeFrance")

tourDeFranceRouter = Router()

tourDeFranceRouter.get('/', tourDeFranceController.home)
tourDeFranceRouter.get('/cyclists', tourDeFranceController.cyclingIndex)
tourDeFranceRouter.get('/cyclists/type/:type', tourDeFranceController.cyclingType)
tourDeFranceRouter.get('/cyclist/:id', tourDeFranceController.cyclingShow)
tourDeFranceRouter.get('/teams', tourDeFranceController.teamIndex)
tourDeFranceRouter.get('/team/:id', tourDeFranceController.teamShow)

module.exports = tourDeFranceRouter