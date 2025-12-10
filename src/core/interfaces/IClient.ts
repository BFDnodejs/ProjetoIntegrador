import { Client } from '../models/Client';
import { IBaseRepository } from './IBaseEntity';

export interface IClientRepository extends IBaseRepository<Client> {
  findByCnpj(cnpj: string): Promise<Client | null>;
  findByCode(code: number): Promise<Client | null>;
}