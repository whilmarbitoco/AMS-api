const { index, create, edit, addStudent } = require('../controllers/classController')
const router = require('express').Router()
const authenticate = require('../middleware/auth')

router.get('/', index);
router.post('/', authenticate,create)
router.put('/:id', authenticate, edit)
router.post('/:id/add', addStudent)

module.exports = router;