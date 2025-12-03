
import { BaseEntity } from './BaseEntity';

export class Service extends BaseEntity {
  constructor(
    id: string | null,
    tenantId: string,
    public name: string,
    public code: string,
    public defaultPrice: number | null
  ) {
    super(id, tenantId);
  }
}