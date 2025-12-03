import { IBaseEntity } from './IBaseEntity';

export interface IUser extends IBaseEntity {
  email: string;
  passwordHash: string;
  role: string;
}