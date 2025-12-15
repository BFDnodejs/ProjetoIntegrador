import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService';
import { z } from 'zod';

const ClientRegisterSchema = z.object({
  code: z.number().nullable().optional(),
  nickname: z.string().min(1),
  companyName: z.string().min(1),
  cnpj: z.string().length(14), 
});

const ClientIdSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)),
});

const ClientUpdateSchema = z.object({
  code: z.number().optional(),
  nickname: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
  cnpj: z.string().length(14).optional(),
}).refine(data => data.code !== undefined || data.nickname || data.companyName || data.cnpj, "At least one field must be provided for update.");

export class ClientController {
  constructor(private clientService: ClientService) {}

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const clientData = ClientRegisterSchema.parse(req.body);
      const client = await this.clientService.register(clientData);
      return res.status(201).json(client);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }
  
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = ClientIdSchema.parse(req.params);
      const client = await this.clientService.getById(id);
      if (!client) return res.status(404).json({ error: "Client not found" });
      return res.status(200).json(client);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const clients = await this.clientService.getAll();
      return res.status(200).json(clients);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = ClientIdSchema.parse(req.params);
      const clientData = ClientUpdateSchema.parse(req.body);
      const client = await this.clientService.update(id, clientData);
      return res.status(200).json({ ...client, message: "Client updated successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(404).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = ClientIdSchema.parse(req.params);
      await this.clientService.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(404).json({ error: error.message });
    }
  }
}
