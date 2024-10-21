const db = require('../models')
const bcrypt = require('bcrypt')
const { notFound, Created, Forbidden, Success } = require('../utils/responseUtils')
const { validateStudent, validateEditStudent, validateName, validateUsername, validatePassword } = require('../utils/validateInputUtils')


async function index(req, res) {

    const students = await db.Student.findAll({ include: [{model: db.User}]});

   res.json(students);
}

// create a new student with all the params needed
async function create(req, res) {
    const {lrn, firstname, lastname, username, email, password} = req.body
    const validateBody = await validateStudent(lrn, firstname, lastname, username, email, password)

    if (!validateBody) return notFound(res, 'Missing parameters')

    const checkEmail = await db.User.findOne({where: {email, type: 'student'}}) 
    if (checkEmail) return Forbidden(res, 'Student with that email already exists')

    const checkLrn = await db.Student.findOne({where: {lrn}})
    if (checkLrn) return Forbidden(res, 'Student with that lrn already exists')

    const hashedPassword = await bcrypt.hash(password, 10)  
    const user = await db.User.create({type: 'student', email, username,password: hashedPassword})
    const student = await db.Student.create({userID: user.id,lrn, firstname, lastname})

    return Created(res, "Student created", student) 
}

async function edit(req, res) {
    const { id } = req.params;
    const { firstname, lastname, username, password } = req.body;

    if (!id) return notFound(res, 'Missing parameters')
    const valUsername = await validateUsername(username)
    const valPassword = await validatePassword(password)

    const valName = await validateName(firstname, lastname)
    if (!valName) return notFound(res, 'Missing body parameters')

    const student = await db.Student.findByPk(id);
    if (!student) return notFound(res, 'Student with that id not found');

    const user = await db.User.findByPk(student.userID);
    if (!user) return notFound(res, 'User related to that Student not found');

    if (valUsername) {
        user.update({ username })
    }
    if (valPassword) {
        const hashed = await bcrypt.hash(password, 10)
        user.update({ password: hashed })
    }

    await student.update({ firstname, lastname });

    return Success(res, "Student updated");
}

async function destroy(req, res) {
    const {id} = req.params

    const student = await db.User.findByPk(id)
    if (!student) return notFound(res, 'Student not found')
    
    await student.destroy()
    return Success(res, 'Student deleted')
}


module.exports = {
    index,
    create,
    destroy,
    edit
}