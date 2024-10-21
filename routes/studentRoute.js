const { index, create, destroy, edit } = require('../controllers/studentController');

const router = require('express').Router();

router.get('/', index)
router.post("/", create)
router.delete("/:id", destroy)
router.put("/:id", edit)

module.exports = router;