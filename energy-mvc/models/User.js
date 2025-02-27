const db = require("../db/connect")

class User {
    constructor({ registration_id, name, password, username, email, postcode, region}) {
        this.registration_id = registration_id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.postcode = postcode;
        this.email = email;
        this.region = region;
        this.account_number = account_number
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT registration_id, username, account_number, email  FROM registration_info WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneById(registration_id) {
        const response = await db.query("SELECT registration_id, email, username FROM registration_info WHERE registration_id = $1", [registration_id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { name, password, username, email, postcode, region } = data;
        if(username == undefined || password == undefined) throw Error("Ensure username and password are both provided")
        let response = await db.query("INSERT INTO registration_info (name, password, username, email, postcode, region) VALUES ($1, $2, $3, $4, $5, $6) RETURNING registration_id;",
            [name, password, username, email, postcode, region]);
        const newId = response.rows[0].login_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }

}

module.exports = { User }