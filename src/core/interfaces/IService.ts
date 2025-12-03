import { IBaseEntity } from './IBaseEntity';

export interface IService extends IBaseEntity {
  name: string;
  code: string;
  defaultPrice: number | null;
}