// UserController.test.ts
import { UserController } from '../../src/controller/UserController';
import { UserService } from '../../src/services/UserService';
import { AuthenticateUserService } from '../../src/services/AuthenticateUserService';
import { Request, Response } from 'express';

const mockUserService = {
  register: jest.fn(),
  getById: jest.fn(),
  // ... outros métodos mockados
};

const mockAuthService = {
  execute: jest.fn(),
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('UserController', () => {
  let userController: UserController;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
    userController = new UserController(
      mockUserService as unknown as UserService,
      mockAuthService as unknown as AuthenticateUserService
    );
  });

  describe('login', () => {
    it('should autenticate the user and return a token (Status 200)', async () => {
      const req = {
        body: { email: 'test@test.com', password: 'password123' }
      } as Request;

      const authResult = { token: 'fake-jwt-token', user: { id: 1, email: 'test@test.com' } };
      mockAuthService.execute.mockResolvedValue(authResult);

      await userController.login(req, res);

      expect(mockAuthService.execute).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(authResult);
    });

    it('should return 401 in case of authentication fail', async () => {
      const req = { body: { email: 'test@test.com', password: 'wrong' } } as Request;
      
      // Simula erro lançado pelo service (ex: senha incorreta)
      mockAuthService.execute.mockRejectedValue(new Error('Incorrect password'));

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Incorrect password' });
    });
  });
});