import { IClientRepository } from '../core/interfaces/IClient';
import { Client } from '../core/models/Client';

interface ClientCreationRequest {
  code?: number | null;
  nickname: string;
  companyName: string;
  cnpj: string;
}

interface ClientUpdateRequest {
  code?: number;
  nickname?: string;
  companyName?: string;
  cnpj?: string;
}

export class ClientService {
  constructor(private clientRepository: IClientRepository) {}

  async register(data: ClientCreationRequest): Promise<Client> {
    const existingCnpj = await this.clientRepository.findByCnpj(data.cnpj);
    if (existingCnpj) {
      throw new Error("Client with this CNPJ already exists.");
    }

    if (data.code) {
      const existingCode = await this.clientRepository.findByCode(data.code);
      if (existingCode) {
        throw new Error("Client with this Code already exists.");
      }
    }

    const client = new Client(null, data.code || null, data.nickname, data.companyName, data.cnpj);
    return this.clientRepository.save(client);
  }
  
  async getById(id: number): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }

  async getAll(): Promise<Client[]> {
    return this.clientRepository.listAll();
  }

  async update(id: number, data: ClientUpdateRequest): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error("Client not found.");
    }

    if (data.cnpj && data.cnpj !== client.cnpj) {
      const existingClient = await this.clientRepository.findByCnpj(data.cnpj);
      if (existingClient) {
        throw new Error("CNPJ is already in use by another client.");
      }
      client.cnpj = data.cnpj;
    }

    if (data.code !== undefined && data.code !== client.code) {
       const existingCode = await this.clientRepository.findByCode(data.code);
       if (existingCode) {
         throw new Error("Code is already in use by another client.");
       }
       client.code = data.code;
    }

    if (data.nickname) client.nickname = data.nickname;
    if (data.companyName) client.companyName = data.companyName;

    return this.clientRepository.save(client);
  }

  async delete(id: number): Promise<void> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error("Client not found.");
    }
    await this.clientRepository.delete(id);
  }
}
