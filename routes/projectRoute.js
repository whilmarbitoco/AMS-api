const router = require("express").Router()
const { index, create, destroy, getOne, update } = require("../controllers/projectController")
const authenticate = require("../middleware/auth")

router.post('/create', authenticate, create) 
router.get('/:id', getOne)
router.get('/', index)
router.patch('/:id', authenticate, update)
router.delete('/:id', authenticate, destroy)




module.exports = router