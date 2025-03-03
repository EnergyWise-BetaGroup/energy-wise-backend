const express = require('express')
const cors = require('cors')

const usersRouter = require('./router/users')
const statsRouter = require('./router/stats')


const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Routing
app.get("/", (req, res) => {
    res.send({title: "EnergyWise", description: "A CO2 footprint calculator and monitoring tool"})
})

app.use('/users', usersRouter)
app.use('/stats', statsRouter)

module.exports = app