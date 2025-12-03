import { BaseEntity } from './BaseEntity';

export class User extends BaseEntity {
  constructor(
    id: string | null,
    tenantId: string,
    public email: string,
    public passwordHash: string,
    public role: string
  ) {
    super(id, tenantId);
  }
}