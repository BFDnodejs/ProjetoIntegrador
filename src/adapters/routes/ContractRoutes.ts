import { Router } from "express";
import { ContractRepository } from "../../repositories/ContractRepository";
import { ContractService } from "../../services/ContractService";
import { ContractController } from "../../controller/ContractController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const contractRepository = new ContractRepository();
const contractService = new ContractService(contractRepository);
const contractController = new ContractController(contractService);

const contractRouter = Router();

contractRouter.use(ensureAuthenticated);

contractRouter.post("/", (req, res) => contractController.create(req, res));
contractRouter.get("/", (req, res) => contractController.getAll(req, res));
contractRouter.get("/:id", (req, res) => contractController.getById(req, res));
contractRouter.put("/:id", (req, res) => contractController.update(req, res));
contractRouter.delete("/:id", (req, res) =>
  contractController.delete(req, res)
);

export { contractRouter };
