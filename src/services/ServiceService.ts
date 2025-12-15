import { IServiceRepository } from '../core/interfaces/IService';
import { Service } from '../core/models/Service';

interface ServiceCreationRequest {
  name: string;
  code: string;
  defaultPrice?: number;
}

interface ServiceUpdateRequest {
  name?: string;
  code?: string;
  defaultPrice?: number;
}

export class ServiceService {
  constructor(private serviceRepository: IServiceRepository) {}

  async create(data: ServiceCreationRequest): Promise<Service> {
    const existingService = await this.serviceRepository.findByCode(data.code);
    if (existingService) {
      throw new Error("Service with this code already exists.");
    }

    const service = new Service(null, data.name, data.code, data.defaultPrice || null);
    return this.serviceRepository.save(service);
  }

  async getById(id: number): Promise<Service | null> {
    return this.serviceRepository.findById(id);
  }

  async getAll(): Promise<Service[]> {
    return this.serviceRepository.listAll();
  }

  async update(id: number, data: ServiceUpdateRequest): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new Error("Service not found.");
    }

    if (data.code && data.code !== service.code) {
      const codeExists = await this.serviceRepository.findByCode(data.code);
      if (codeExists) {
        throw new Error("Service code already in use.");
      }
      service.code = data.code;
    }

    if (data.name) service.name = data.name;
    if (data.defaultPrice !== undefined) service.defaultPrice = data.defaultPrice;

    return this.serviceRepository.save(service);
  }

  async delete(id: number): Promise<void> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new Error("Service not found.");
    }
    await this.serviceRepository.delete(id);
  }
}
