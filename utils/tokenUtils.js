const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../models")

async function comparePassword(password, userPass) {
    const compare = await bcrypt.compare(password, userPass)
    return compare   
}

async function generateToken(user) {
    const token = jwt.sign({ email: user.email }, process.env['JWT_TOKEN'])
    return token
}

async function validateToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env['JWT_TOKEN'], async (err, decoded) => {
        if (err) {
          resolve(false)
        
        } else {
          const user = await db.User.findOne({ where: { email: decoded.email } })          
          resolve(user)
        }
      });
    });
  }
  

module.exports = {
    comparePassword,
    validateToken,
    generateToken
}