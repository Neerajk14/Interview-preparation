const { Router } = require("express");
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middleware/auth.middleware");
const authRouter = Router();

authRouter.post("/register", authController.registeredUserController);

authRouter.post("/login", authController.loginUserController);

authRouter.get("/logout", authController.logoutUserController);

authRouter.get(
  "/get-me",
  authMiddleware.authUser,
  authController.getMeController,
);
module.exports = authRouter;
