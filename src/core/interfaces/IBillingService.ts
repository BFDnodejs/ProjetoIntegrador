import { Contract } from '../models/Contract';

export interface IBillingService {
  calculateMonthlyValue(contract: Contract): number;
  generateInvoice(contractId: number, month: Date): Promise<string>;
}