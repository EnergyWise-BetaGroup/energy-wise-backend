const db = require("../db/connect")

/* SQL File for info
CREATE TABLE registration_info
  (
    registration_id BIGINT GENERATED ALWAYS AS IDENTITY, 
    account_number VARCHAR(30) ,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(64) NOT NULL,
    house_size INTEGER, 
    postcode VARCHAR(7) NOT NULL,
    region VARCHAR(30) NOT NULL,
    provider VARCHAR(50),
    api_key VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, --need to be changed 
    PRIMARY KEY(registration_id)
  );
*/

class User {
    constructor({ registration_id, name, password, username, email, post_code, region}) {
        this.registration_id = registration_id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.post_code = post_code;
        this.email = email;
        this.region = region;
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT registration_id, username, password FROM login_info WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneById(registration_id) {
        const response = await db.query("SELECT registration_id, username FROM login_info WHERE registration_id = $1", [registration_id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { name, password, username, email, post_code, region } = data;
        if(username == undefined || password == undefined) throw Error("Ensure username and password are both provided")
        let response = await db.query("INSERT INTO login_info (name, password, username, email, post_code, region) VALUES ($1, $2, $3, $4, $5, $6) RETURNING registration_id;",
            [name, password, username, email, post_code, region]);
        const newId = response.rows[0].login_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }

}

module.exports = { User }