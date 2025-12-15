import { IContractRepository } from "../core/interfaces/IContracts";
import { Contract } from "../core/models/Contract";
import { ContractStatus } from "../core/interfaces/enum";

interface ContractDTO {
  contractCode: string;
  clientId: number;
  serviceId: number;
  quantity: number;
  unitPrice: number;
  startDate: Date;
  endDate?: Date;
  status: ContractStatus;
  observation?: string;
}

export class ContractService {
  constructor(private contractRepository: IContractRepository) {}

  async create(data: ContractDTO): Promise<Contract> {
    const existingContract = await this.contractRepository.findByCode(
      data.contractCode
    );
    if (existingContract) {
      throw new Error("Contract with this code already exists.");
    }

    const contract = new Contract(
      null,
      data.contractCode,
      data.clientId,
      data.serviceId,
      data.quantity,
      data.unitPrice,
      data.startDate,
      data.endDate || null,
      data.status,
      data.observation || null
    );

    return this.contractRepository.save(contract);
  }

  async update(id: number, data: Partial<ContractDTO>): Promise<Contract> {
    const contract = await this.contractRepository.findById(id);
    if (!contract) {
      throw new Error("Contract not found.");
    }

    if (data.contractCode) contract.contractCode = data.contractCode;
    if (data.clientId) contract.clientId = data.clientId;
    if (data.serviceId) contract.serviceId = data.serviceId;
    if (data.quantity) contract.quantity = data.quantity;
    if (data.unitPrice) contract.unitPrice = data.unitPrice;
    if (data.startDate) contract.startDate = data.startDate;
    if (data.endDate !== undefined) contract.endDate = data.endDate || null;
    if (data.status) contract.status = data.status;
    if (data.observation !== undefined)
      contract.observation = data.observation || null;

    return this.contractRepository.save(contract);
  }

  async getById(id: number): Promise<Contract | null> {
    return this.contractRepository.findById(id);
  }

  async getAll(): Promise<Contract[]> {
    return this.contractRepository.listAll();
  }

  async delete(id: number): Promise<void> {
    const contract = await this.contractRepository.findById(id);
    if (!contract) {
      throw new Error("Contract not found.");
    }
    await this.contractRepository.delete(id);
  }
}
