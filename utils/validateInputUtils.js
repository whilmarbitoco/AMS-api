async function validateUsername(username) {
    return username != null && username.length > 0
}

async function validatePassword(password) {
    return password != null && password.length > 0
}

async function validateEmail(email) {
    return email != null && email.length > 0
}

async function validateUser(username, email, password) {
    return await validateUsername(username) && await validateEmail(email) && await validatePassword(password)
}

async function validateTeacher(firstname, lastname) {
    return await validateUsername(firstname) && await validateUsername(lastname)
    
}

module.exports = {
   validateUser,
   validateUsername,
   validateEmail,
   validatePassword,
   validateTeacher
}