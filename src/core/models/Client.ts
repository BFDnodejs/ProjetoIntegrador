import { BaseEntity } from './BaseEntity';

export class Client extends BaseEntity {
  constructor(
    id: string | null,
    tenantId: string,
    public code: number,
    public nickname: string,
<<<<<<< HEAD
    public companyName: string
=======
    public companyName: string,
    private cnpj: string
>>>>>>> 67585b5a62cc73f87731939fd3d7a1a398b09700
  ) {
    super(id, tenantId);
  }
}