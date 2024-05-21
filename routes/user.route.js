const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middlewares/auth.middleware");
const { AuthController } = require("../controllers/auth.controller");
const { UserController } = require("../controllers/user.controller");

router.patch("/users/", ensureAuth, UserController.UpdateUser);
router.post("/users/login", AuthController.login);
router.post("/users/login-with-lms", AuthController.loginWithLMS);
router.get("/users/logout", AuthController.logout);
router.get("/users/me", ensureAuth, UserController.getUserDetails);
router.post("/users/forgotPassword", UserController.forgotPassword);
router.post("/users/resetPassword", UserController.resetPassword);
router.post("/users/changePassword", ensureAuth, UserController.changePassword);

module.exports = router;
