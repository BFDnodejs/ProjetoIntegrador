import { BaseEntity } from './BaseEntity';
import { RoleUser } from '../interfaces/enum';

export class User extends BaseEntity {
  constructor(
    id: string | null,
    tenantId: string,
    public email: string,
    public passwordHash: string,
    public role: RoleUser
  ) {
    super(id, tenantId);
  }
}