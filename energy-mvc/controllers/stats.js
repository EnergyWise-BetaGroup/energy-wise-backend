const { Stats } =  require("../models/Stats")
const { User } =  require("../models/User")
const axios = require('axios')

async function getStats(req, res) {
    try {
      console.log("getstats hit");
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

async function getDonut(req, res) {
    try {
        const userId = req.body.registration_id;

        const donutData = await User.getOneById(userId)
        

        const data = { data: { donut: donutData } };
        // const postcode = donutData.data.donut.postcode;

        const response_api = await axios.get(`https://api.carbonintensity.org.uk/regional/postcode/AL7`)

        const carbonIntensityData = response_api.data
        const generationMix = carbonIntensityData.data[0].data[0].generationmix

        const response = await axios.post('http://energy-python:3001/generate-pie-visualisation', generationMix)

        // res.status(200).json({ "html": response.data.visualisation_html })
        res.status(200).json({ "html": response.data.visualisation_html })
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

module.exports = {
    getStats,
    getDonut
}