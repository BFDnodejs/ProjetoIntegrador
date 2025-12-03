import { IBaseEntity } from './IBaseEntity';
import { ContractStatus } from './enum';

export interface IContract extends IBaseEntity {
  contractCode: string;
  clientCode: number;
  clientNickname: string;
  serviceCode: string;
  quantity: number;
  unitPrice: number;
  startDate: Date;
  endDate: Date | null;
  status: ContractStatus;
  observation: string | null;
}