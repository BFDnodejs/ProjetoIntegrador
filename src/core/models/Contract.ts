import { BaseEntity } from './BaseEntity';
import { ContractStatus } from '../interfaces/enum';

export class Contract extends BaseEntity {
  constructor(
    id: string | null,
    tenantId: string,
    public contractCode: string,  public clientCode: number,
    public clientNickname: string,
    public serviceCode: string,
    public quantity: number,
    public unitPrice: number,
    public startDate: Date,
    public endDate: Date | null,
    public status: ContractStatus,
    public observation: string | null
  ) {
    super(id, tenantId);
  }
}