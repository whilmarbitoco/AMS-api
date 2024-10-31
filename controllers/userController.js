const bcrypt = require("bcrypt");
const db = require("../models");
const {
  validateToken,
  generateToken,
  comparePassword,
} = require("../utils/tokenUtils");
const {
  notFound,
  Ok,
  Forbidden,
  Created,
  authFailed,
  Login,
} = require("../utils/responseUtils");
const {
  validatePassword,
  validateEmail,
  validateUser,
} = require("../utils/validateInputUtils");

async function index(req, res) {
  const users = await db.User.findAll();
  res.json(users);
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!validateEmail(email) && !validatePassword(password))
    return notFound(res, "Missing parameter");

  const user = await db.User.findOne({ where: { email } });

  if (!user) return notFound(res, "User not found");

  const compare = await comparePassword(password, user.password);

  if (!compare) return authFailed(res, "Invalid Email or Password");

  const jwtToken = await generateToken(user);

  return Login(res, user, jwtToken);
}

async function signup(req, res) {
  const { username, password, email, type } = req.body;

  const validateBody = await validateUser(username, email, password);

  if (!validateBody) return notFound(res, "Missing parameter");

  const user = await db.User.findOne({ where: { email } });

  if (user) return Forbidden(res, "Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  let newUser;

  if (type) {
    newUser = await db.User.create({ type, username, email, password: hashed });
  } else {
    newUser = await db.User.create({ username, email, password: hashed });
  }

  return Created(res, "User Created", newUser);
}

async function deleteUser(req, res) {
  const { id } = req.params;

  if (!id) return notFound(res, "Missing parameter");

  const user = await db.User.findOne({ where: { id } });

  if (!user) return notFound(res, "User not found");

  await user.destroy();

  return Ok(res, "User Deleted");
}

async function verify(req, res) {
  const token = req.headers.auth;
  if (!token) return notFound(res, "Token not found");

  const tokenVal = await validateToken(token);

  if (!tokenVal) return authFailed(res, "Invalid Token");

  return res.json(tokenVal);
}

module.exports = {
  index,
  login,
  signup,
  verify,
  deleteUser,
};
