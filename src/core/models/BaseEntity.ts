export abstract class BaseEntity {
  constructor(
    public readonly id: string | null,
    public readonly tenantId: string
  ) {}
}