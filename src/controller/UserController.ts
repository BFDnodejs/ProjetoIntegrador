import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthenticateUserService } from '../services/AuthenticateUserService';
import { z } from 'zod';

const UserRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const UserAuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const UserIdSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)),
});

const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
}).refine(data => data.email || data.password, "At least one field (email or password) must be provided for update.");


export class UserController {
  constructor(
    private userService: UserService,
    private authenticateUserService: AuthenticateUserService
  ) {}

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const userData = UserRegisterSchema.parse(req.body);
      const user = await this.userService.register(userData);
      return res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }
  
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const userData = UserAuthSchema.parse(req.body);
      const result = await this.authenticateUserService.execute(userData.email, userData.password); 
      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(401).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = UserIdSchema.parse(req.params);
      const user = await this.userService.getById(id);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.getAll();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = UserIdSchema.parse(req.params);
      const userData = UserUpdateSchema.parse(req.body);
      const user = await this.userService.update(id, userData);
      return res.status(200).json({ ...user, message: "User updated successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(404).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = UserIdSchema.parse(req.params);
      await this.userService.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(404).json({ error: error.message });
    }
  }
}