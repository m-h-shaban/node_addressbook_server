const express = require("express");
const router = express.Router();

const addressbook_controller = require("../controllers/addressbook.controller");

router.post("/add", addressbook_controller.validate('addAddressBook'), addressbook_controller.create);
router.get("/", addressbook_controller.get_all);
router.delete("/:key", addressbook_controller.delete);
router.put("/:key", addressbook_controller.validate('updateAddressBook'), addressbook_controller.update);
router.get("/:key", addressbook_controller.get);


module.exports = router;