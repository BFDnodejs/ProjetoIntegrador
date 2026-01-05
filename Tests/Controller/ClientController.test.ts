import { ClientController } from '../../src/controller/ClientController';
import { ClientService } from '../../src/services/ClientService';
import { Request, Response } from 'express';

// Mock do Service
const mockClientService = {
  register: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock do Response do Express
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('ClientController', () => {
  let clientController: ClientController;
  let res: Response;

  beforeEach(() => {
    // Reiniciando os mocks antes de cada teste
    jest.clearAllMocks();
    res = mockResponse();
    // Injetando o mock do service no controller
    clientController = new ClientController(mockClientService as unknown as ClientService);
  });

  describe('register', () => {
    it('should register a client with sucess (Stat 201)', async () => {
      const req = {
        body: { nickname: 'Company X', companyName: 'X Ltda', cnpj: '12345678901234' }
      } as Request;

      const expectedClient = { id: 1, ...req.body };
      mockClientService.register.mockResolvedValue(expectedClient);

      await clientController.register(req, res);

      expect(mockClientService.register).toHaveBeenCalledWith(expect.objectContaining(req.body));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedClient);
    });

    it('should return 400 if the Zod validation fails', async () => {
      const req = {
        body: { nickname: '', cnpj: '123' } // Dados inválidos
      } as Request;

      await clientController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Validation failed' }));
      expect(mockClientService.register).not.toHaveBeenCalled();
    });

    it('should return error 400 if the the service sends a generic error', async () => {
      const req = {
        body: { nickname: 'Company Y', companyName: 'Y Ltda', cnpj: '12345678901234' }
      } as Request;

      mockClientService.register.mockRejectedValue(new Error('CNPJ duplicated'));

      await clientController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'CNPJ duplicated' });
    });
  });

  describe('getById', () => {
    it('should return 404 error if the client is not found', async () => {
      const req = { params: { id: '99' } } as unknown as Request;
      mockClientService.getById.mockResolvedValue(null);

      await clientController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Client not found' });
    });
  });
});