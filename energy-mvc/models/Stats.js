const db = require("../db/connect")

class Stats {
    constructor(datapoint, start_datetime, end_datetime) {
        this.datapoint = datapoint, 
        this.start_datetime = start_datetime, 
        this.end_datetime = end_datetime
    }

    static async getMeterDataForUserById(registration_id) {
        const response = await db.query("SELECT consumption, start_datetime, end_datetime FROM smart_meter_data WHERE registration_id = $1", [registration_id]);
        if (response.rows.length === 0) {
            throw new Error("No data for this user.");
        }
        return response.rows.map(data => new Stats(data.consumption, data.start_datetime, data.end_datetime));
    }

    static async getIntensityDataForUserById(registration_id) {
        const response = await db.query("SELECT co2_intensity, co2_start_datetime, co2_end_datetime FROM co2_intensity WHERE registration_id = $1", [registration_id]);
        if (response.rows.length === 0) {
            throw new Error("No data for this user.");
        }
        return response.rows.map(data => new Stats(data.co2_intensity, data.co2_start_datetime, data.co2_end_datetime));
    }
}

module.exports = {
    Stats
}