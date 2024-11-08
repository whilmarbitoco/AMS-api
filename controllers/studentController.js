const db = require("../models");
const bcrypt = require("bcrypt");
const {
  notFound,
  Created,
  Forbidden,
  Success,
  Ok,
} = require("../utils/responseUtils");
const {
  validateStudent,
  validateEditStudent,
  validateName,
  validateUsername,
  validatePassword,
  validateEmail,
} = require("../utils/validateInputUtils");

async function index(req, res) {
  const students = await db.Student.findAll({ include: [{ model: db.User }] });

  res.json(students);
}

// create a new student with all the params needed
async function create(req, res) {
  const { lrn, strand, firstname, lastname, username, email, password } =
    req.body;
  const validateBody = await validateStudent(
    lrn,
    strand,
    firstname,
    lastname,
    username,
    email,
    password
  );

  if (!validateBody) return notFound(res, "Missing parameters");

  const checkEmail = await db.User.findOne({ where: { email } });
  if (checkEmail) return Forbidden(res, "Email already exists");

  const checkLrn = await db.Student.findOne({ where: { lrn } });
  if (checkLrn) return Forbidden(res, "Student with that lrn already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.User.create({
    type: "student",
    email,
    username,
    password: hashedPassword,
  });
  const student = await db.Student.create({
    userID: user.id,
    lrn,
    firstname,
    lastname,
    strand,
  });

  return Created(res, "Student created", student);
}

async function edit(req, res) {
  const { id } = req.params;
  const { firstname, lastname, username, password } = req.body;

  if (!id) return notFound(res, "Missing parameters");
  const valUsername = await validateUsername(username);
  const valPassword = await validatePassword(password);

  const valName = await validateName(firstname, lastname);
  if (!valName) return notFound(res, "Missing body parameters");

  const student = await db.Student.findByPk(id);
  if (!student) return notFound(res, "Student with that id not found");

  const user = await db.User.findByPk(student.userID);
  if (!user) return notFound(res, "User related to that Student not found");

  if (valUsername) {
    user.update({ username });
  }
  if (valPassword) {
    const hashed = await bcrypt.hash(password, 10);
    user.update({ password: hashed });
  }

  await student.update({ firstname, lastname });

  return Created(res, "Student Updated", student);
}

async function destroy(req, res) {
  const { id } = req.params;

  const student = await db.Student.findByPk(id);
  if (!student) return notFound(res, "Student not found");

  const user = await db.User.findOne({ where: { id: student.userID } });

  await student.destroy();
  await user.destroy();

  return Ok(res, "Student deleted");
}

module.exports = {
  index,
  create,
  destroy,
  edit,
};
