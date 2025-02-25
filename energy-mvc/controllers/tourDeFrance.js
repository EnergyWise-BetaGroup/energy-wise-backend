const { Team, Cyclist } =  require("../models/TourDeFrance")

const home = async (req, res) => {
    res.status(200).json({
        success:true,
        response:"Welcome to the Tour de France 2024 API"
    })
}

const cyclingIndex = async (req, res) => {
    try {
        const cyclists = await Cyclist.getAllCyclists()
        res.status(200).json({
            success:true,
            cyclists:cyclists
        })
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Unable to retrieve cyclists",
            error:err
        })
    }
}

const cyclingType = async (req, res) => {
    try {
        let type = req.params.type
        type = type.split(' ').slice(0, 2).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
        const cyclists = await Cyclist.getAllByType(type)
        res.status(200).json({
            success:true,
            cyclists:cyclists
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message:"Unable to retrieve cyclist type",
            error:err
        })
    }
}

const cyclingShow = async (req, res) => {
    try {
        const id = req.params.id
        const cyclist = await Cyclist.getCyclist(id)
        res.status(200).json({
            success:true,
            cyclist:cyclist
        })
    } catch (err) {
        res.status(404).json({
            success:false,
            message:"Unable to retrieve cyclist",
            error:err
        })
    }
}

const teamIndex = async (req, res) => {
    try {
        const teams = await Team.getAllTeams()
        res.status(200).json({
            success:true,
            teams:teams
        })
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Unable to retrieve teams",
            error:err
        })
    }
}

const teamShow = async (req, res) => {
    try {
        const id = req.params.id
        const teamRiders = await Cyclist.getTeamRiders(id)
        res.status(200).json({
            success:true,
            teamRiders:teamRiders
        })
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Unable to retrieve teams",
            error:err
        })
    }
}

module.exports = {
    home,
    cyclingIndex,
    cyclingType,
    cyclingShow,
    teamIndex,
    teamShow
}