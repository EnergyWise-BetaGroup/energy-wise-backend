const db = require("../db/connect")

class Team {
    constructor({team_id, team_name, bicycle, team_owner, team_budget}) {
        this.id = team_id
        this.team_name = team_name
        this.bicycle = bicycle
        this.team_owner = team_owner
        this.team_budget = team_budget
    }

    static async getAllTeams() {
        try {
            const { rows } = await db.query("SELECT * FROM teams;")
            if (!rows.length) {
                throw new Error("No teams found")
            }
            return rows.map((team) => new Team(team))
        } catch (error) {
            throw new Error("Error fetching teams")
        } 
    }
}

class Cyclist {
    constructor({cyclist_id, name, age, height, nationality, type_of_cyclist, team_id, team_name, bicycle, team_owner, team_budget}) {
        this.id = cyclist_id
        this.name = name
        this.age = age
        this.height = height
        this.nationality = nationality
        this.type_of_cyclist = type_of_cyclist
        this.team_id = team_id
        if (team_name) {
            this.team = new Team({team_id, team_name, bicycle, team_owner, team_budget})
        } 
    }

    static async getAllCyclists() {
        try {
            const { rows } = await db.query("SELECT * FROM cyclists;")
            if (!rows.length) {
                throw new Error("No cyclists found")
            }
            return rows.map((cyclist) => new Cyclist(cyclist))
        } catch (error) {
            throw new Error("Error fetching cyclists")
        }
    }

    static async getAllByType(type) {
        console.log('model type', type)
        try {
            const { rows } = await db.query("SELECT * FROM cyclists WHERE type_of_cyclist = $1;", [type])
            if (!rows.length) {
                throw new Error("No cyclists found")
            }
            return rows.map((cyclist) => new Cyclist(cyclist))
        } catch (error) {
            throw new Error("Error fetching cyclists")
        }
    }

    static async getCyclist(id) {
        try {
            const { rows } = await db.query("SELECT * FROM cyclists INNER JOIN teams ON cyclists.team_id = teams.team_id WHERE cyclist_id = $1;", [id])
            if (!rows.length) {
                throw new Error("No cyclist found")
            }
            console.log('model', rows)
            return new Cyclist(rows[0])
        } catch (error) {
            throw new Error("Error fetching cyclist")
        }
    }

    static async getTeamRiders(id) {
        try {
            console.log('model team id', id)
            const { rows } = await db.query("SELECT * FROM cyclists INNER JOIN teams ON cyclists.team_id = teams.team_id WHERE teams.team_id = $1;", [id])
            console.log('model hit')
            if (!rows.length) {
                throw new Error("No cyclists found")
            }
            return rows.map((cyclist) => new Cyclist(cyclist))
        } catch (error) {
            throw new Error("Error fetching cyclists")
        }
    }
}



module.exports = { Team, Cyclist }