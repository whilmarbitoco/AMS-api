const {
  index,
  create,
  destroy,
  edit,
} = require("../controllers/studentController");
const router = require("express").Router();
const authenticate = require("../middleware/auth");

router.get("/", index);
router.post("/", authenticate, create);
router.delete("/:id", authenticate, destroy);
router.put("/:id", authenticate, edit);

module.exports = router;
