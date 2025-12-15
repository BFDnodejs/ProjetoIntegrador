import { IContractRepository } from "../core/interfaces/IContracts";
import { Contract } from "../core/models/Contract";
import { pool } from "../adapters/config/config";
import { RowDataPacket } from "mysql2";
import { ContractStatus } from "../core/interfaces/enum";

export class ContractRepository implements IContractRepository {
  async save(contract: Contract): Promise<Contract> {
    if (contract.id === null) {
      const sql = `
        INSERT INTO contract 
        (contract_code, client_id, service_id, quantity, unit_price, start_date, end_date, status, observation) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await pool.execute(sql, [
        contract.contractCode,
        contract.clientId,
        contract.serviceId,
        contract.quantity,
        contract.unitPrice,
        contract.startDate,
        contract.endDate,
        contract.status,
        contract.observation,
      ]);
      const insertId = (result as any).insertId;
      return new Contract(
        insertId,
        contract.contractCode,
        contract.clientId,
        contract.serviceId,
        contract.quantity,
        contract.unitPrice,
        contract.startDate,
        contract.endDate,
        contract.status,
        contract.observation
      );
    } else {
      const sql = `
        UPDATE contract 
        SET contract_code = ?, client_id = ?, service_id = ?, quantity = ?, unit_price = ?, start_date = ?, end_date = ?, status = ?, observation = ?
        WHERE id = ?
      `;
      await pool.execute(sql, [
        contract.contractCode,
        contract.clientId,
        contract.serviceId,
        contract.quantity,
        contract.unitPrice,
        contract.startDate,
        contract.endDate,
        contract.status,
        contract.observation,
        contract.id,
      ]);
      return contract;
    }
  }

  async findById(id: number): Promise<Contract | null> {
    const sql = `SELECT * FROM contract WHERE id = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Contract(
      row.id,
      row.contract_code,
      row.client_id,
      row.service_id,
      row.quantity,
      row.unit_price,
      row.start_date,
      row.end_date,
      row.status as ContractStatus,
      row.observation
    );
  }

  async findByCode(code: string): Promise<Contract | null> {
    const sql = `SELECT * FROM contract WHERE contract_code = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [code]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Contract(
      row.id,
      row.contract_code,
      row.client_id,
      row.service_id,
      row.quantity,
      row.unit_price,
      row.start_date,
      row.end_date,
      row.status as ContractStatus,
      row.observation
    );
  }

  async findByClientId(clientId: number): Promise<Contract[]> {
    const sql = `SELECT * FROM contract WHERE client_id = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [clientId]);

    return rows.map(
      (row) =>
        new Contract(
          row.id,
          row.contract_code,
          row.client_id,
          row.service_id,
          row.quantity,
          row.unit_price,
          row.start_date,
          row.end_date,
          row.status as ContractStatus,
          row.observation
        )
    );
  }

  async listAll(): Promise<Contract[]> {
    const sql = `SELECT * FROM contract`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql);

    return rows.map(
      (row) =>
        new Contract(
          row.id,
          row.contract_code,
          row.client_id,
          row.service_id,
          row.quantity,
          row.unit_price,
          row.start_date,
          row.end_date,
          row.status as ContractStatus,
          row.observation
        )
    );
  }

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM contract WHERE id = ?`;
    await pool.execute(sql, [id]);
  }
}
