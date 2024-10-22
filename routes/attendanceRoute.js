const { index, getAll, attendance } = require('../controllers/attendanceController')
const authenticate = require('../middleware/auth')

const router = require('express').Router()

router.post('/', authenticate, index)
router.get('/:classID', authenticate, getAll)
router.post('/:classID', authenticate, attendance)

module.exports = router