import { BaseEntity } from './BaseEntity';

export class Service extends BaseEntity {
  constructor(
    id: number | null,
    public name: string,
    public code: string,
    public defaultPrice: number | null
  ) {
    super(id);
  }
}