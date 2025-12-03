import { IContract } from './IContracts';

export interface IBillingService {
  calculateTotalValue(contract: IContract): number;
  calculateDaysUntilEnd(contract: IContract): number;
  generateMonthlyInvoice(tenantId: string, month: number, year: number): void;
}