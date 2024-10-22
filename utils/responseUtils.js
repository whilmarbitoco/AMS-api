async function notFound(res, message) {
    return res.status(404).json({ message })
}

async function Forbidden(res, message) {
    return res.status(403).json({ message })
}

async function Ok(res, message) {
    return res.status(200).json({ message })
}

async function Login(res, user, token) {
    res.status(200).json({message: "Login Successful", user, token })
}

async function Created(res, message, created) {
    return res.status(201).json({ message, created})
}

async function authFailed(res, message) {
    return res.status(401).json({ message })
}

async function badRequest(res, message) {
    return res.status(400).json({ message })
}

module.exports = {
    notFound,
    Forbidden,
    Ok,
    Created,
    authFailed,
    badRequest,
    Login
}