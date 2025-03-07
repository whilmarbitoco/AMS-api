const db = require("../models");
const { notFound, Forbidden, Ok } = require("../utils/responseUtils");
const { dateNow } = require("../utils/dateUtils");
const { Sequelize, Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { log } = require("console");
const XlsxPopulate = require("xlsx-populate");
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
    attributes: {
      include: [
        [
          Sequelize.fn("strftime", "%Y-%m-%d", Sequelize.col("date")),
          "formattedDate",
        ],
      ],
    },
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
    where: {
      classID: classID,
      date: dateNow(),
    },
    attributes: {
      include: [
        [
          Sequelize.fn("strftime", "%Y-%m-%d", Sequelize.col("date")),
          "formattedDate",
        ],
      ],
    },
    include: db.Student,
  });
  console.log("------------------------------" + attendance);

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

async function exportAttendance(req, res) {
  try {
    const { classID } = req.params;

    const attendance = await db.Attendance.findAll({
      where: {
        classID,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("strftime", "%Y-%m", Sequelize.col("date")),
            Sequelize.fn("strftime", "%Y-%m", Sequelize.literal("CURRENT_DATE"))
          ),
        ],
      },
      attributes: {
        include: [
          [
            Sequelize.fn("strftime", "%Y-%m-%d", Sequelize.col("date")),
            "formattedDate",
          ],
        ],
      },
      include: db.Student,
      raw: true, // Convert Sequelize instances to plain objects
    });

    if (!attendance.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    const templatePath = path.join(__dirname, "test.xlsx");

    const wb = await XlsxPopulate.fromFileAsync(templatePath);
    const sheet = wb.sheet("s1");

    let row = 18;

    attendance.forEach((record, index) => {
      sheet.row(row).style("fontSize", 7);

      sheet.cell(`E${row}`).value(index + 1); // No.
      sheet.cell(`G${row}`).value(record["Student.lastname"]);
      sheet.cell(`I${row}`).value(record["Student.firstname"]);

      const dateParts = record["formattedDate"].split("-");

      const day = parseInt(dateParts[2], 10);

      let colIndex = 12 + (day - 1);
      let colLetter = String.fromCharCode(64 + colIndex);

      // 🏷 Mark attendance
      sheet.cell(`${colLetter}${row}`).value(record.status === "1" ? "✓" : " ");

      row++;
    });

    // Generate new file and send response
    const outputFilePath = path.join(
      __dirname,
      "wb2c0-" + Math.random().toString(36) + "-mnhs.xlsx"
    );
    await wb.toFileAsync(outputFilePath);

    return res.download(outputFilePath);
  } catch (error) {
    console.error("Error exporting attendance:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { exportAttendance };

module.exports = {
  index,
  getAll,
  attendance,
  getNow,
  exportAttendance,
};
