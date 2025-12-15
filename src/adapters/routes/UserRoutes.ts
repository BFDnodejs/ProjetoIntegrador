import { Router } from "express";
import { UserController } from "../../controller/UserController";
import { UserRepository } from "../../repositories/UserRepository";
import { UserService } from "../../services/UserService";
import { AuthenticateUserService } from "../../services/AuthenticateUserService";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authenticateUserService = new AuthenticateUserService(userRepository);

const userController = new UserController(userService, authenticateUserService);

router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));

router.get("/:id", (req, res) => userController.getById(req, res));
router.get("/", (req, res) => userController.getAll(req, res));
router.patch("/:id", (req, res) => userController.update(req, res));
router.delete("/:id", (req, res) => userController.delete(req, res));

export default router;
