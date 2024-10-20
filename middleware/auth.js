const jwt = require("jsonwebtoken")
const db = require("../models")
const { badRequest, authFailed, notFound } = require("../utils/responseUtils")
const { validateToken } = require("../utils/tokenUtils")

async function authenticate(req, res, next) {
    
    const token = req.headers.auth
   
    if (!token) return notFound(res, "Token not found")

    const valToken = await validateToken(token)
 
    if (!valToken) return authFailed(res, "Invalid Token")
    
    req.userToken = valToken
        
    next()

}

module.exports = authenticate