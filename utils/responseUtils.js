async function notFound(res, error) {
    return res.status(404).json({ auth: false, error: error })
}

async function Forbidden(res, error) {
    return res.status(403).json({ error: error })
}

async function Ok(res, user, auth = false, token = null) {
    return res.status(200).json({ auth, user, token })
}

async function Created(res, message, created) {
    return res.status(201).json({ message, created })
}

async function Success(res, message) {
    return res.status(200).json({ message })
    
}

async function authFailed(res, error) {
    return res.status(401).json({ auth: false, error: error })
}

async function badRequest(res, error) {
    return res.status(400).json({auth: false, error})
}

module.exports = {
    notFound,
    Forbidden,
    Ok,
    Created,
    authFailed,
    badRequest,
    Success
}