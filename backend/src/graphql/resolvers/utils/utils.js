// backend\src\graphql\resolvers\utils\utils.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const logger = require('../../../logger'); // Import the logger
const saltRounds = 10;

const encryptPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
}

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

const getUserFromToken = (token) => {
    logger.info("Calling getUserFromToken"); // Log the info
    const tokenString = token.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        return User.findById(decoded.id);
    } catch (err) {
        logger.error("Error in getUserFromToken", err); // Log the error
        return null;
    }
};

module.exports = { encryptPassword, comparePassword, getUserFromToken };
