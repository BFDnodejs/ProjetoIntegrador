import { Service } from '../models/Service';
import { IBaseRepository } from './IBaseEntity';

export interface IServiceRepository extends IBaseRepository<Service> {
  findByCode(code: string): Promise<Service | null>;
}