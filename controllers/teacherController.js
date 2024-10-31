const db = require("../models/");
const { notFound, Ok, Created, Forbidden } = require("../utils/responseUtils");
const {
  validateName,
  validateUsername,
  validateEmail,
} = require("../utils/validateInputUtils");

async function index(req, res) {
  const teacher = await db.Teacher.findAll({ include: db.User });

  res.json(teacher);
}

async function create(req, res) {
  const { firstname, lastname, email, username } = req.body;
  const user = req.userToken;

  const validateBody =
    (await validateUsername(username)) &&
    (await validateUsername(firstname)) &&
    (await validateUsername(lastname)) &&
    (await validateEmail(email));
  if (!validateBody) return notFound(res, "Missing parameter");

  const checkTeacher = await db.Teacher.findOne({ where: { userID: user.id } });

  if (checkTeacher)
    return Forbidden(
      res,
      "Teacher with that email already exists. Please edit your profile."
    );

  const newTeacher = await db.Teacher.create({
    firstname,
    lastname,
    userID: user.id,
  });

  user.update({ email, username });

  return Created(res, "Teacher Created", newTeacher);
}

async function current(req, res) {
  const user = req.userToken;

  const teacher = await db.Teacher.findOne({
    where: { userID: user.id },
    include: db.User,
  });

  if (!teacher)
    return notFound(res, "Teacher does not have personal information");

  return res.json(teacher);
}

async function edit(req, res) {
  const { firstname, lastname, email, username } = req.body;
  const user = req.userToken;

  const validateBody =
    (await validateName(firstname, lastname, username)) &&
    (await validateEmail(email));
  if (!validateBody) return notFound(res, "Missing parameter");

  const checkTeacher = await db.Teacher.findOne({ where: { userID: user.id } });

  if (!checkTeacher)
    return notFound(res, "Teacher does not have personal information");

  await checkTeacher.update({ firstname, lastname });
  await user.update({ email, username });

  return Ok(res, "Teacher Updated");
}
module.exports = {
  index,
  create,
  edit,
  current,
};
