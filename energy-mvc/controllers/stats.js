const { Stats } =  require("../models/Stats")
const axios = require('axios')

async function getStats(req, res) {
    try {
        const userId = req.body.registration_id;

        const meterData = await Stats.getMeterDataForUserById(userId)
        const intensityData = await Stats.getIntensityDataForUserById(userId)

        const data = {data: {meter: meterData, intensity: intensityData}}

        const response = await axios.post('http://energy-python:3001/generate-visualisation', data)

        res.status(200).json({ "html": response.data.visualisation_html })
        //res.status(200).json({data: {meter: meterData, intensity: intensityData}})
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

module.exports = {
    getStats,
}