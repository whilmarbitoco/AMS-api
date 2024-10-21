async function validateUsername(username) {
    return username != null && username.length > 0
}

async function validatePassword(password) {
    return password != null && password.length > 0
}

async function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return email != null && email.length > 0 && emailRegex.test(email)
}

async function validateUser(username, email, password) {
    return await validateUsername(username) && await validateEmail(email) && await validatePassword(password)
}

async function validateName(firstname, lastname) {
    return await validateUsername(firstname) && await validateUsername(lastname)
}

async function validateEditStudent(username, firstname, lastname, password) {
    return await validateUsername(username) && await validateUsername(firstname) && await validateUsername(lastname) && await validatePassword(password)
    
}

async function validateStudent(lrn, firstname, lastname, username, email, password) {
    return await validateUsername(lrn) && await validateUsername(firstname) && await validateUsername(lastname) && await validateUsername(username) && await validateEmail(email) && await validatePassword(password)
    
}

module.exports = {
   validateUser,
   validateUsername,
   validateEmail,
   validatePassword,
   validateName,
   validateStudent,
   validateEditStudent
}