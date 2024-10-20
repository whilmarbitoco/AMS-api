const db = require("../models/")
const { notFound, Ok, Created, Forbidden } = require("../utils/responseUtils")
const { validateTeacher } = require("../utils/validateInputUtils")


async function index(req, res) {
    const teacher = await db.Teacher.findAll()

    res.json(teacher)
}

async function create(req, res) {
    const { firstname, lastname } = req.body
    const user = req.userToken

    const validateBody = await validateTeacher(firstname, lastname)
    if (!validateBody) return notFound(res, "Missing parameter")

    const checkTeacher = await db.Teacher.findOne({ where: { userID: user.id } })

    if (checkTeacher) return Forbidden(res, "Teacher already exists")

    const newTeacher = await db.Teacher.create({ firstname, lastname, userID: user.id })
    
    return Created(res, "Teacher Created", newTeacher)

}

async function edit(req, res) {
    const { firstname, lastname } = req.body
    const user = req.userToken

    const validateBody = await validateTeacher(firstname, lastname)
    if (!validateBody) return notFound(res, "Missing parameter")  
        
    const checkTeacher = await db.Teacher.findOne({ where: { userID: user.id } })

    if (!checkTeacher) return notFound(res, "Teacher does not have personal information")

    const updatedTeacher = await db.Teacher.update({ firstname, lastname }, { where: { userID: user.id } })

    console.log(updatedTeacher);
    
    return Created(res, "Teacher Updated", "updated")
}

module.exports = {
    index,
    create,
    edit
}