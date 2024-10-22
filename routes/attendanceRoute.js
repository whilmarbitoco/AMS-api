const { index, getAll } = require('../controllers/attendanceController')
const authenticate = require('../middleware/auth')

const router = require('express').Router()

router.post('/', authenticate, index)
router.get('/:classID', authenticate, getAll)

module.exports = router