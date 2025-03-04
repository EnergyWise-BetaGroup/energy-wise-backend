const db = require("../db/connect")
const axios = require('axios')

class User {
    constructor({ registration_id, name, password, username, email, postcode, region, meter_mpan=null, meter_serial=null, api_key =null}) {
        this.registration_id = registration_id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.postcode = postcode;
        this.email = email;
        this.region = region;
        this.api_key = api_key
        this.meter_mpan = meter_mpan
        this.meter_serial = meter_serial
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT registration_id, username, password FROM registration_info WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneById(registration_id) {
        const response = await db.query("SELECT * FROM registration_info WHERE registration_id = $1", [registration_id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { name, password, username, email, postcode, region, api_key } = data;
        if(username == undefined || password == undefined) throw Error("Ensure username and password are both provided")
        let response = await db.query("INSERT INTO registration_info (name, password, username, email, postcode, region, api_key) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING registration_id;",
            [name, password, username, email, postcode, region, api_key]);
        const newId = response.rows[0].registration_id;
        const newUser = await User.getOneById(newId);
        newUser.password = "#"
        newUser.updateMeterInfo(data.account_number, data.api_key)
        return newUser;
    }

    async updateMeterInfo(account, api) {
        try{
            const token = Buffer.from(`${api}:`).toString('base64');
            const response = await axios.get(`https://api.octopus.energy/v1/accounts/${account}`, {
                headers: {
                    "Authorization": `Basic ${token}`
                }
            })
            const data = response.data
            this.meter_mpan = data.properties[0].electricity_meter_points[0].mpan
            this.meter_serial = data.properties[0].electricity_meter_points[0].meters[0].serial_number
            db.query("UPDATE registration_info SET meter_mpan = $1, meter_serial = $2 WHERE registration_id = $3;", [this.meter_mpan, this.meter_serial, this.registration_id])
        } catch(err) {
            console.error("Error: ", err)
        }
    }
}

module.exports = { User }