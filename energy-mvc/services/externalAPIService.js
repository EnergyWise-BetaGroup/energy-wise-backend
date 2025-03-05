const axios = require("axios");

const fetchExternalMeterData = async (api_key, mpan, serial) => {
  const todays_date = new Date();
  const two_weeks_ago = new Date();
  two_weeks_ago.setDate(todays_date.getDate() - 13.99);
  try {
    const token = Buffer.from(`${api_key}:`).toString("base64");
    const response = await axios.get(
      `https://api.octopus.energy/v1/electricity-meter-points/${mpan}/meters/${serial}/consumption/?page_size=800&period_from=${two_weeks_ago.toISOString()}&period_to=${todays_date.toISOString()}&order_by=period`,
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching external data:");
    throw error;
  }
};

const fetchExternalCO2Data = async (postcode) => {
  const todays_date = new Date();
  const two_weeks_ago = new Date();
  two_weeks_ago.setDate(todays_date.getDate() - 13.99);

  try {
    const response = await axios.get(
      `https://api.carbonintensity.org.uk/regional/intensity/${two_weeks_ago.toISOString()}/${todays_date.toISOString()}/postcode/${postcode}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching external data:");
    throw error;
  }
};

const fetchExternalMeterInfo = async (api, account) => {
  try {
    const token = Buffer.from(`${api}:`).toString("base64");
    const response = await axios.get(
      `https://api.octopus.energy/v1/accounts/${account}`,
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Error fetching external data:");
    throw error;
  }
};

const fetchFutureCO2Data = async (postcode) => {
  try {
    const currentTime = new Date('2025-03-05T19:05:36.867Z')
    const timeIn2HrBlocks = new Date()

    timeIn2HrBlocks.setHours(2*Math.floor(currentTime.getHours()/2) )
    timeIn2HrBlocks.setMinutes(1)
    const token = Buffer.from(`${api}:`).toString("base64");
    const response = await axios.get(
      `https://api.carbonintensity.org.uk/regional/intensity/${timeIn2HrBlocks.toISOString()}/fw24h/postcode/${postcode}`);
    return response;
  } catch (err) {
    console.error("Error fetching external data:");
    throw error;
  }
}

module.exports = {
  fetchExternalMeterData,
  fetchExternalCO2Data,
  fetchExternalMeterInfo,
  fetchFutureCO2Data
};
