const { index, getAll, attendance, getNow } = require('../controllers/attendanceController')
const authenticate = require('../middleware/auth')

const router = require('express').Router()

router.post('/', authenticate, index)
router.get('/:classID', authenticate, getAll)
router.get('/:classID/now', authenticate, getNow)
router.post('/:classID/present', authenticate, attendance)

module.exports = router