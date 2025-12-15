import { Router } from 'express';
import { ClientRepository } from '../../repositories/ClientRepository';
import { ClientService } from '../../services/ClientService';
import { ClientController } from '../../controller/ClientController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const clientRoutes = Router();

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

clientRoutes.use(ensureAuthenticated);

clientRoutes.post('/', (req, res) => clientController.register(req, res));
clientRoutes.get('/:id', (req, res) => clientController.getById(req, res));
clientRoutes.get('/', (req, res) => clientController.getAll(req, res));
clientRoutes.put('/:id', (req, res) => clientController.update(req, res));
clientRoutes.delete('/:id', (req, res) => clientController.delete(req, res));

export { clientRoutes };
