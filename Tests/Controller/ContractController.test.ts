// ContractController.test.ts
import { ContractController } from '../../src/controller/ContractController';
import { ContractService } from '../../src/services/ContractService';
import { ContractStatus } from '../../src/core/interfaces/enum'; // Importe seu Enum real aqui
import { Request, Response } from 'express';

const mockContractService = {
  create: jest.fn(),
  // ... mocks
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ContractController', () => {
  let contractController: ContractController;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
    contractController = new ContractController(mockContractService as unknown as ContractService);
  });

  describe('create', () => {
    it('should create a contract by converting date strings correctly.', async () => {
      const req = {
        body: {
          contractCode: 'CTR-001',
          clientId: 1,
          serviceId: 2,
          quantity: 10,
          unitPrice: 100,
          startDate: '2023-01-01', // Zod vai usar coerce.date() aqui
          endDate: '2023-12-31',
          status: ContractStatus.ACTIVE, // Use o valor do Enum (ou string correspondente se for enum de string)
        }
      } as Request;

      mockContractService.create.mockResolvedValue({ id: 1, ...req.body });

      await contractController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      
      // Verifica se o Service foi chamado
      expect(mockContractService.create).toHaveBeenCalled();
      
      // Verifica se o argumento passado pro service contém objetos Date, não strings
      const calledArg = mockContractService.create.mock.calls[0][0];
      expect(calledArg.startDate).toBeInstanceOf(Date);
    });
  });
});