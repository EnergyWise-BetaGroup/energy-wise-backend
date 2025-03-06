const { User } = require("../models/User");
const {
    fetchExternalMeterData,
    fetchExternalCO2Data,
    fetchFutureCO2Data
} = require("../services/externalAPIService");
const axios = require("axios");

const cache = {};

async function getStats(req, res) {
    try {
        const userId = req.body.registration_id;
        const currentTime = new Date();
        const expireTime = new Date(currentTime.getTime() + 30*60000);

        let data

        if (cache.hasOwnProperty(userId) && currentTime < cache[userId].expireTime) {
            data = cache[userId].data;
        } else {
            const currentUser = await User.getOneById(userId);

            const [octopusMeterData, energyCarbonData] = await Promise.all([
                fetchExternalMeterData(
                    currentUser.api_key,
                    currentUser.meter_mpan,
                    currentUser.meter_serial
                ),
                fetchExternalCO2Data(currentUser.postcode),
            ]);
            // const octopusMeterData = await fetchExternalMeterData(currentUser.api_key, currentUser.meter_mpan, currentUser.meter_serial)
            // const energyCarbonData = await fetchExternalCO2Data(currentUser.postcode)

            const meterData = octopusMeterData.data.results.map((reading) => {
                return {
                    datapoint: reading.consumption,
                    start_datetime: reading.interval_start,
                    end_datetime: reading.interval_end,
                };
            });

            const intensityData = energyCarbonData.data.data.data.map(
                (carbon) => {
                    return {
                        datapoint: carbon.intensity.forecast,
                        start_datetime: carbon.from,
                        end_datetime: carbon.to,
                    };
                }
            );

            data = {
                data: { meter: meterData, intensity: intensityData },
            };
            cache[userId] = { expireTime: expireTime, data: data };
        }
        console.log("Passed data to /generate-visualisation:");
        console.log(data);
        const response = await axios.post(
            "http://energy-python:3001/generate-visualisation",
            data
        );

        res.status(200).json({ html: response.data.visualisation_html });
        //res.status(200).json(data)
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

async function getDonut(req, res) {
    try {
        const userId = req.body.registration_id;
        
        const userData = await User.getOneById(userId);

        const response_api = await axios.get(
            `https://api.carbonintensity.org.uk/regional/postcode/${userData.postcode}`
        );

        const carbonIntensityData = response_api.data;
        const generationMix = carbonIntensityData.data[0].data[0].generationmix;

        console.log(generationMix);
        console.log("Passed data to /generate-pie-visualisation:");
        const response = await axios.post(
            "http://energy-python:3001/generate-pie-visualisation",
            generationMix
        );

        res.status(200).json({ html: response.data.visualisation_html });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

async function getGauge(req, res) {
    try {
        const userId = req.body.registration_id;
        const currentTime = new Date();
        const expireTime = new Date(currentTime.getTime() + 30*60000);

        let data

        if (cache.hasOwnProperty(userId) && currentTime < cache[userId].expireTime) {
            data = cache[userId].data;
        } else {
            const currentUser = await User.getOneById(userId);

            const [octopusMeterData, energyCarbonData] = await Promise.all([
                fetchExternalMeterData(
                    currentUser.api_key,
                    currentUser.meter_mpan,
                    currentUser.meter_serial
                ),
                fetchExternalCO2Data(currentUser.postcode),
            ]);
            // const octopusMeterData = await fetchExternalMeterData(currentUser.api_key, currentUser.meter_mpan, currentUser.meter_serial)
            // const energyCarbonData = await fetchExternalCO2Data(currentUser.postcode)

            const meterData = octopusMeterData.data.results.map((reading) => {
                return {
                    datapoint: reading.consumption,
                    start_datetime: reading.interval_start,
                    end_datetime: reading.interval_end,
                };
            });

            const intensityData = energyCarbonData.data.data.data.map(
                (carbon) => {
                    return {
                        datapoint: carbon.intensity.forecast,
                        start_datetime: carbon.from,
                        end_datetime: carbon.to,
                    };
                }
            );

            data = {
                data: { meter: meterData, intensity: intensityData },
            };
            cache[userId] = { expireTime: expireTime, data: data };
        }
        console.log("Passed data to /generate-gauge-visualisation:");
        console.log(data);
        const response = await axios.post(
            "http://energy-python:3001/generate-gauge-visualisation",
            data
        );

        res.status(200).json(response.data);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

async function getTable(req, res) {
    try {
        const userId = req.body.registration_id;
        
        const userData = await User.getOneById(userId);

        const dataResponse = await fetchFutureCO2Data(userData.postcode)

        const filteredResponse = (await dataResponse).data.data.data.map(
            dataPoint => {return( {start: dataPoint.from, intensity: dataPoint.intensity.forecast})}
        )

        console.log("Passed data to /generate-table-visualisation:");
        console.log(filteredResponse);

        const response = await axios.post(
            "http://energy-python:3001/generate-table-visualisation",
            filteredResponse
        );

        //console.log(response);

        res.status(200).json({ html: response.data.visualisation_html });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

module.exports = {
    getStats,
    getDonut,
    getGauge,
    getTable
};
