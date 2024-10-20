const router = require("express").Router()
const { login, signup, index, verify, deleteUser } = require('../controllers/userController')
const authenticate = require("../middleware/auth")

router.get("/", index)
router.post("/login", login)
router.post("/signup", signup)
router.delete("/delete/:id", deleteUser)
router.post("/verify", verify)

module.exports = router
