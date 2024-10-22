const db = require("../models/")
const { notFound, Ok, Created, Forbidden } = require("../utils/responseUtils")
const { validateName } = require("../utils/validateInputUtils")


async function index(req, res) {
    const teacher = await db.Teacher.findAll({include: db.User})

    res.json(teacher)
}

async function create(req, res) {
    const { firstname, lastname } = req.body
    const user = req.userToken

    const validateBody = await validateName(firstname, lastname, "true")
    if (!validateBody) return notFound(res, "Missing parameter")

    const checkTeacher = await db.Teacher.findOne({ where: { userID: user.id } })

    if (checkTeacher) return Forbidden(res, "Teacher with that email already exists. Please edit your profile.")

    const newTeacher = await db.Teacher.create({ firstname, lastname, userID: user.id })
    
    return Created(res, "Teacher Created", newTeacher)

}

async function edit(req, res) {
    const { firstname, lastname } = req.body
    const user = req.userToken

    const validateBody = await validateName(firstname, lastname)
    if (!validateBody) return notFound(res, "Missing parameter")  
        
    const checkTeacher = await db.Teacher.findOne({ where: { userID: user.id } })

    if (!checkTeacher) return notFound(res, "Teacher does not have personal information")

    const updatedTeacher = await db.Teacher.update({ firstname, lastname }, { where: { userID: user.id } })
    
    return Created(res, "Teacher Updated", updatedTeacher)
}

module.exports = {
    index,
    create,
    edit
}