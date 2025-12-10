import { BaseEntity } from './BaseEntity';

export class Client extends BaseEntity {
  constructor(
    id: number | null,
    public code: number | null,
    public nickname: string,
    public companyName: string,
    public cnpj: string 
  ) {
    super(id);
  }
}