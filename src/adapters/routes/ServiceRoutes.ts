import { Router } from "express";
import { ServiceController } from "../../controller/ServiceController";
import { ServiceService } from "../../services/ServiceService";
import { ServiceRepository } from "../../repositories/ServiceRepository";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const serviceRoutes = Router();
const serviceRepository = new ServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

serviceRoutes.use(ensureAuthenticated);

serviceRoutes.post("/", (req, res) => serviceController.create(req, res));

serviceRoutes.get(
  "/",

  (req, res) => serviceController.getAll(req, res)
);

serviceRoutes.get(
  "/:id",

  (req, res) => serviceController.getById(req, res)
);

serviceRoutes.put(
  "/:id",

  (req, res) => serviceController.update(req, res)
);

serviceRoutes.delete(
  "/:id",

  (req, res) => serviceController.delete(req, res)
);

export { serviceRoutes };
