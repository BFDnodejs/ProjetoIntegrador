import { Request, Response } from "express";
import { ContractService } from "../services/ContractService";
import { z } from "zod";
import { ContractStatus } from "../core/interfaces/enum";

const ContractSchema = z.object({
  contractCode: z.string(),
  clientId: z.number(),
  serviceId: z.number(),
  quantity: z.number(),
  unitPrice: z.number(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  status: z.nativeEnum(ContractStatus),
  observation: z.string().optional(),
});

const ContractUpdateSchema = ContractSchema.partial();

const ContractIdSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

export class ContractController {
  constructor(private contractService: ContractService) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = ContractSchema.parse(req.body);
      const contract = await this.contractService.create(data);
      return res.status(201).json(contract);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = ContractIdSchema.parse(req.params);
      const data = ContractUpdateSchema.parse(req.body);
      const contract = await this.contractService.update(id, data);
      return res.status(200).json(contract);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
      }
      return res.status(404).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = ContractIdSchema.parse(req.params);
      const contract = await this.contractService.getById(id);
      if (!contract)
        return res.status(404).json({ error: "Contract not found" });
      return res.status(200).json(contract);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const contracts = await this.contractService.getAll();
      return res.status(200).json(contracts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = ContractIdSchema.parse(req.params);
      await this.contractService.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }
}
