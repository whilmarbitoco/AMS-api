const db = require("../models")
const { notFound, Created, Forbidden } = require("../utils/responseUtils")
const { validateName } = require("../utils/validateInputUtils")

async function index(req, res) {
    const classes = await db.Class.findAll()
    res.json(classes)
}

async function create(req, res) {
    const {subject, timeIn} = req.body

    const user = req.userToken // current login teacher

    const valBody = validateName(subject, timeIn)
    if (!valBody) return notFound(res, "Missing body parameters")

    if (user.type != 'teacher') return Forbidden(res, "Only teacher can create classes")
    
    const getTeacher = await db.Teacher.findOne({ where: {userID: user.id} })
    if (!getTeacher) return notFound(res, "Teacher does not exist. Please create teacher profile.")
    
     await db.Class.create({teacherID: getTeacher.id, subject, timeIn})
    
    return Created(res, "Class created")
}

async function edit(req, res) {
    const {subject, timeIn} = req.body
    const { id } = req.params

    const user = req.userToken // current login teacher

    const valBody = validateName(subject, timeIn)
    if (!valBody) return notFound(res, "Missing body parameters")
    if (!id) return notFound(res, "Missing parameters")

    if (user.type != 'teacher') return Forbidden(res, "Only teacher can create classes")
    
    const getTeacher = await db.Teacher.findOne({ where: {userID: user.id} })
    if (!getTeacher) return notFound(res, "Teacher does not exist. Please create teacher profile.")

    const getClass = await db.Class.findOne({ where: {id, teacherID: getTeacher.id} })
    if (!getClass) return notFound(res, "Class does not exist")

    await getClass.update({subject, timeIn})

    return Created(res, "Class updated")
  

}

async function addStudent(req, res) {
    const classID = req.params.id
    const { studentID } = req.body
    const user = req.userToken // current login teacher

    if (!studentID) return notFound(res, "Missing studentID parameter")
    if (!classID) return notFound(res, "Missing classID parameter") 
    if (user.type != 'teacher') return Forbidden(res, "Only teacher can add students to class")

    const getTeacher = await db.Teacher.findOne({ where: {userID: user.id} })
    if (!getTeacher) return notFound(res, "Teacher does not exist. Please create teacher profile.")
    
    const getClass = await db.Class.findOne({ where: {id: classID, teacherID: getTeacher.id} })
    if (!getClass) return notFound(res, "Class does not exist")

    // check if student is already in class
    // finish this later
}

module.exports = {
    index,
    create,
    edit,
    addStudent
}