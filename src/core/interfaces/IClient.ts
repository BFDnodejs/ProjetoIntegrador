import { IBaseEntity } from './IBaseEntity';

export interface IClient extends IBaseEntity {
  code: number;
  nickname: string;
  companyName: string;
}