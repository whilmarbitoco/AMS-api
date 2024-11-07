const db = require("../models");
const { get } = require("../routes/attendanceRoute");
const { notFound, Forbidden, Ok } = require("../utils/responseUtils");
const { dateNow } = require("../utils/dateUtils");
const { Sequelize } = require("sequelize");
const { raw } = require("mysql2");

async function index(req, res) {
  const { classID } = req.body;
  const user = req.userToken;

  if (!classID) return notFound(res, "Missing classID parameter");
  if (user.type != "teacher")
    return Forbidden(res, "Only teacher can create attendance");

  const getTeacher = await db.Teacher.findOne({ where: { userID: user.id } });

  const getClass = await db.Class.findOne({
    where: { id: classID, teacherID: getTeacher.id },
  });
  if (!getClass) return notFound(res, "Class not found");

  const students = await db.ClassStudent.findAll({
    where: { classID: classID },
  });
  if (!students) return notFound(res, "Class has no students");

  const checkAtt = await db.Attendance.findOne({
    where: { classID, date: dateNow() },
  });

  console.log(dateNow());

  if (checkAtt) return Forbidden(res, "Class Already has attedance");

  await db.Attendance.bulkCreate(
    students.map((student) => ({
      classID: classID,
      studentID: student.studentID,
      date: dateNow(),
    }))
  );

  return Ok(res, "Attendance created");
}

async function getAll(req, res) {
  const { classID } = req.params;
  const user = req.userToken;

  if (!classID) return notFound(res, "Missing classID parameter");
  if (user.type != "teacher")
    return Forbidden(res, "Only teacher can view attendance");

  const getTeacher = await db.Teacher.findOne({ where: { userID: user.id } });

  const getClass = await db.Class.findOne({
    where: { id: classID, teacherID: getTeacher.id },
  });
  if (!getClass) return notFound(res, "Class not found");

  const attendance = await db.Attendance.findAll({
    where: { classID: classID },
    include: db.Student,
  });

  if (!attendance) return notFound(res, "Attendance not found");

  return res.json(attendance);
}

async function getNow(req, res) {
  const { classID } = req.params;
  const user = req.userToken;

  if (!classID) return notFound(res, "Missing classID parameter");
  if (user.type != "teacher")
    return Forbidden(res, "Only teacher can view attendance");

  const getTeacher = await db.Teacher.findOne({ where: { userID: user.id } });

  const getClass = await db.Class.findOne({
    where: { id: classID, teacherID: getTeacher.id },
  });
  if (!getClass) return notFound(res, "Class not found");

  const attendance = await db.Attendance.findAll({
    where: { classID: classID, date: dateNow() },
    include: db.Student,
  });
  if (!attendance) return notFound(res, "Attendance not found");

  return res.json(attendance);
}

async function attendance(req, res) {
  const { classID } = req.params;
  const { studentID } = req.body;
  const user = req.userToken;

  if (!classID) return notFound(res, "Missing classID parameter");
  if (!studentID) return notFound(res, "Missing studentID parameter");
  if (user.type != "teacher")
    return Forbidden(res, "Only teacher can view attendance");

  const getTeacher = await db.Teacher.findOne({ where: { userID: user.id } });
  const getClass = await db.Class.findOne({
    where: { id: classID, teacherID: getTeacher.id },
  });
  if (!getClass) return notFound(res, "Class not found");

  const getAttendance = await db.Attendance.findOne({
    where: { studentID, classID, date: dateNow() },
  });

  if (!getAttendance)
    return notFound(res, "No Attendance found. Please create attendance first");

  await getAttendance.update({ status: "Present" });

  return Ok(res, "Attendance updated");
}

module.exports = {
  index,
  getAll,
  attendance,
  getNow,
};
