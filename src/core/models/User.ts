import { BaseEntity } from './BaseEntity';


export class User extends BaseEntity {
  constructor(
    id: number | null,
    public email: string,
    public passwordHash: string,
    public role: "EMPLOYEE"
  ) {
    super(id);
  }
}