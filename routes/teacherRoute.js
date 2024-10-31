const router = require("express").Router();
const {
  index,
  create,
  edit,
  current,
} = require("../controllers/teacherController");
const authenticate = require("../middleware/auth");

router.get("/", index);
router.post("/", authenticate, create);
router.post("/current", authenticate, current);
router.put("/", authenticate, edit);

module.exports = router;
