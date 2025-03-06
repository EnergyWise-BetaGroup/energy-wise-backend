const axios = require("axios");

const fetchExternalMeterData = async (api_key, mpan, serial) => {
  const todays_date = new Date();
  const two_weeks_ago = new Date();
  two_weeks_ago.setDate(todays_date.getDate() - 13);
  two_weeks_ago.setMinutes(todays_date.getMinutes() - 29)
  try {
    const token = Buffer.from(`${api_key}:`).toString("base64");

    console.log(`https://api.octopus.energy/v1/electricity-meter-points/${mpan}/meters/${serial}/consumption/?page_size=1000&period_from=${two_weeks_ago.toISOString()}&period_to=${todays_date.toISOString()}&order_by=period`)

    const response = await axios.get(
      `https://api.octopus.energy/v1/electricity-meter-points/${mpan}/meters/${serial}/consumption/?page_size=1000&period_from=${two_weeks_ago.toISOString()}&period_to=${todays_date.toISOString()}&order_by=period`,
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );
    console.log(response.data.results.length);
    return response;
  } catch (error) {
    console.error("Error fetching external Octo data:");
    throw new Error;
  }
};

const fetchExternalCO2Data = async (postcode) => {
  const todays_date = new Date();
  const two_weeks_ago = new Date();
  todays_date.setDate(todays_date.getDate())
  todays_date.setHours(0)
  two_weeks_ago.setDate(todays_date.getDate() - 13);

  console.log(`https://api.carbonintensity.org.uk/regional/intensity/${two_weeks_ago.toISOString()}/${todays_date.toISOString()}/postcode/${postcode}`);

  try {
  const response = await axios.get(
      `https://api.carbonintensity.org.uk/regional/intensity/${two_weeks_ago.toISOString()}/${todays_date.toISOString()}/postcode/${postcode}`
  );

  console.log(response.data.data.data.length);
  return response;
  } catch (error) {
  console.error("Error fetching external CO2 data:");
  throw new Error;
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
