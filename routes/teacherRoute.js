const router = require("express").Router()
const { index, create, edit } = require("../controllers/teacherController")
const authenticate = require("../middleware/auth")

router.get("/", index)
router.post("/", authenticate,create)
router.put("/", authenticate, edit)

module.exports = router