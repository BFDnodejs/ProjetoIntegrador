import { Contract } from '../models/Contract';
import { IBaseRepository } from './IBaseEntity';

export interface IContractRepository extends IBaseRepository<Contract> {
  findByCode(code: string): Promise<Contract | null>;
  findByClientId(clientId: number): Promise<Contract[]>;
}