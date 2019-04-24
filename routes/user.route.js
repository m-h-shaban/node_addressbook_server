const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

router.post("/login/email", user_controller.validate('loginWithEmailAndPassword'), user_controller.loginWithEmailAndPassword);
router.post("/login/username", user_controller.validate('loginWithUserNameAndPassword'), user_controller.loginWithUserNameAndPassword);
router.post("/login/gmail", user_controller.loginWithGmail);
router.post("/register", user_controller.validate('registerWithEmailAndPassword'), user_controller.registerWithEmailAndPassword);
router.post("/logout", user_controller.logout);
router.get("/current", user_controller.current_user);

module.exports = router;
