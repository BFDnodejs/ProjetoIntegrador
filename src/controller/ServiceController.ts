import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';
import { z } from 'zod';

const ServiceRegisterSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(2),
  defaultPrice: z.number().positive().optional(),
});

const ServiceUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  code: z.string().min(2).optional(),
  defaultPrice: z.number().positive().optional(),
}).refine(data => data.name || data.code || data.defaultPrice !== undefined, "At least one field must be provided for update.");

const ServiceIdSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)),
});

export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const serviceData = ServiceRegisterSchema.parse(req.body);
      const service = await this.serviceService.create(serviceData);
      return res.status(201).json(service);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = ServiceIdSchema.parse(req.params);
      const service = await this.serviceService.getById(id);
      if (!service) return res.status(404).json({ error: "Service not found" });
      return res.status(200).json(service);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const services = await this.serviceService.getAll();
      return res.status(200).json(services);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = ServiceIdSchema.parse(req.params);
      const serviceData = ServiceUpdateSchema.parse(req.body);
      const service = await this.serviceService.update(id, serviceData);
      return res.status(200).json({ ...service, message: "Service updated successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(404).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = ServiceIdSchema.parse(req.params);
      await this.serviceService.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      return res.status(404).json({ error: error.message });
    }
  }
}
