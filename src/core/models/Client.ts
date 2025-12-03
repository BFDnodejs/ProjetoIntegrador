import { BaseEntity } from './BaseEntity';

export class Client extends BaseEntity {
  constructor(
    id: string | null,
    tenantId: string,
    public code: number,
    public nickname: string,
    public companyName: string
  ) {
    super(id, tenantId);
  }
}