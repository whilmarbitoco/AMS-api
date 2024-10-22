const { index, create, edit, addStudent, displayClass, removeStudent } = require('../controllers/classController')
const router = require('express').Router()
const authenticate = require('../middleware/auth')

router.get('/', index);
router.post('/', authenticate,create)
router.put('/:id', authenticate, edit)

// classes
router.post('/:classID/add', authenticate, addStudent)
router.get("/:classID", authenticate, displayClass)
router.delete('/:classID/', authenticate, removeStudent)


module.exports = router;