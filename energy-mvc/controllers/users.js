const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const { User } =  require("../models/User")

const register = async (req, res) => {
    try {
        const data = req.body;
  
        // Generate a salt with a specific cost
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    
        // Hash the password
        data.password = await bcrypt.hash(data.password, salt);
        const result = await User.create(data);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const login = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.getOneByUsername(data.username);
        const match = await bcrypt.compare(data.password, user.password);

        if (match) {
            const payload = { registration_id: user.registration_id  }

            jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, (err, token) =>{
            if(err){ throw new Error('Error in token generation') }
            res.status(200).json({
                success: true,
                token: token,
            });
            });

        } else {
            throw new Error('User could not be authenticated')  
        }
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

async function profile(req, res) {
    try {
      const userId = req.body.registration_id;
      const currentUser = await User.getOneById(userId);
      res.status(200).json(currentUser);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

module.exports = {
    login,
    register,
    profile
}