import { BaseEntity } from './BaseEntity';
import { ContractStatus } from '../interfaces/enum';

export class Contract extends BaseEntity {
  constructor(
    id: number | null,
    public contractCode: string,
    public clientId: number,
    public serviceId: number,
    public quantity: number,
    public unitPrice: number,
    public startDate: Date,
    public endDate: Date | null,
    public status: ContractStatus,
    public observation: string | null
  ) {
    super(id);
  }
}