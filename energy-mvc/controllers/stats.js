const { Stats } =  require("../models/Stats")

async function getStats(req, res) {
    try {
        const userId = req.body.registration_id;

        const meterData = await Stats.getMeterDataForUserById(userId)
        const intensityData = await Stats.getIntensityDataForUserById(userId)
        //const response = await axios.post('http://energy-python:3001/generate-visualisation', data)

        //res.status(200).json({ "html": response.data.visualisation_html })
        res.status(200).json({data: {meter: meterData, intensity: intensityData}})
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

module.exports = {
    getStats,
}