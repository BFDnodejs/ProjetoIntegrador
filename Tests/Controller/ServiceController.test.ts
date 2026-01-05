import { ServiceController } from '../../src/controller/ServiceController';
import { ServiceService } from '../../src/services/ServiceService';
import { Request, Response } from 'express';

// 1. Mock do ServiceService
const mockServiceService = {
  create: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// 2. Helper para Mockar o Response do Express
// Isso permite encadear res.status(200).json(...)
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('ServiceController', () => {
  let serviceController: ServiceController;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa contadores dos mocks antes de cada teste
    res = mockResponse();
    // Injetando o mock como se fosse o Service real
    serviceController = new ServiceController(mockServiceService as unknown as ServiceService);
  });

  describe('create', () => {
    it('should create a sucessfull service (Status 201)', async () => {
      // Cenário
      const req = {
        body: { name: 'Maintenance', code: 'MAN-01', defaultPrice: 150.00 }
      } as Request;
      
      const expectedService = { id: 1, ...req.body };
      mockServiceService.create.mockResolvedValue(expectedService);

      // Ação
      await serviceController.create(req, res);

      // Verificação
      expect(mockServiceService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedService);
    });

    it('should return error 404 if the Zod validation fails', async () => {
      // Cenário code com menos de 2 caracteres
      const req = {
        body: { name: 'Maintenance', code: 'A' } 
      } as Request;

      await serviceController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Validation failed" }));
      expect(mockServiceService.create).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return the service if found (Status 200)', async () => {
      const req = { params: { id: '10' } } as unknown as Request;
      const expectedService = { id: 10, name: 'Limpeza' };
      
      mockServiceService.getById.mockResolvedValue(expectedService);

      await serviceController.getById(req, res);

      // Verifica se o controller converteu a string "10" para number 10
      expect(mockServiceService.getById).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedService);
    });

    it('deve retornar 404 se o serviço não existir', async () => {
      const req = { params: { id: '99' } } as unknown as Request;
      mockServiceService.getById.mockResolvedValue(null);

      await serviceController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Service not found" });
    });
  });

  describe('update', () => {
    it('should sucessfuly update the service (Status 200)', async () => {
      const req = {
        params: { id: '5' },
        body: { name: 'Novo Nome' }
      } as unknown as Request;

      const updatedService = { id: 5, name: 'Novo Nome', code: 'ANTIGO' };
      mockServiceService.update.mockResolvedValue(updatedService);

      await serviceController.update(req, res);

      expect(mockServiceService.update).toHaveBeenCalledWith(5, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Service updated successfully" }));
    });

    it('should fail if it trys to update without sending any field', async () => {
      const req = {
        params: { id: '5' },
        body: {} // Body vazio
      } as unknown as Request;

      await serviceController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockServiceService.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should sucessfuly delete the service (Status 204)', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      
      await serviceController.delete(req, res);

      expect(mockServiceService.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});