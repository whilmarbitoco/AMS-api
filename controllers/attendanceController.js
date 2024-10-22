const db = require("../models")
const { get } = require("../routes/attendanceRoute")
const { notFound, Forbidden, Ok } = require("../utils/responseUtils")

async function index(req, res) {
    const { classID } = req.body
    const user = req.userToken

    if (!classID) return notFound(res, "Missing classID parameter")
    if (user.type != 'teacher') return Forbidden(res, "Only teacher can create attendance")

    const getTeacher = await db.Teacher.findOne({ where: { userID: user.id } })

    const getClass = await db.Class.findOne({ where: { id: classID, teacherID: getTeacher.id } })
    if (!getClass) return notFound(res, "Class not found")

    const students = await db.ClassStudent.findAll({where: {classID: classID}})
    if (!students) return notFound(res, "Class has no students")

    await db.Attendance.bulkCreate(
        students.map(student => ({ classID: classID, studentID: student.id }))
    )
   
    return Ok(res, "Attendance created")
}

async function getAll(req, res) {
    const { classID } = req.params
    const user = req.userToken

    if (!classID) return notFound(res, "Missing classID parameter")
    if (user.type != 'teacher') return Forbidden(res, "Only teacher can view attendance")
    
    const getTeacher = await db.Teacher.findOne({ where: { userID: user.id } })

    const getClass = await db.Class.findOne({ where: { id: classID, teacherID: getTeacher.id } })
    if (!getClass) return notFound(res, "Class not found")

    const attendance = await db.Attendance.findAll({where: {classID: classID}, include: db.Student})
    if (!attendance) return notFound(res, "Attendance not found")
    
    return res.json(attendance)
}

async function attendance(req, res) {

    const { classID } = req.params
    const { studentID } = req.body
    const user = req.userToken

    if (!classID) return notFound(res, "Missing classID parameter")
    if (!studentID) return notFound(res, "Missing studentID parameter")
    if (user.type != 'teacher') return Forbidden(res, "Only teacher can view attendance")

    const getTeacher = await db.Teacher.findOne({ where: { userID: user.id } })
    const getClass = await db.Class.findOne({ where: { id: classID, teacherID: getTeacher.id } })
    if (!getClass) return notFound(res, "Class not found")

    const getStudent = await db.Attendance.findOne({ where: { id: studentID, classID } })
    if (!getStudent) return notFound(res, "Student not found")

    await getStudent.update({ status: "present" })

    return Ok(res, "Attendance updated")
}

module.exports = {
    index,
    getAll,
    attendance
}