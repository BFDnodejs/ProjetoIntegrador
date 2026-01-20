import { IClientRepository } from '../core/interfaces/IClient';
import { Client } from '../core/models/Client';
import { pool } from '../adapters/config/config';
import { RowDataPacket } from 'mysql2';

export class ClientRepository implements IClientRepository {
  
  async save(client: Client): Promise<Client> {
    if (client.id === null) {
      const sql = `INSERT INTO client (code, nickname, company_name, cnpj) VALUES (?, ?, ?, ?)`;
      const [result] = await pool.execute(sql, [client.code, client.nickname, client.companyName, client.cnpj]);
      const insertId = (result as any).insertId;
      return new Client(insertId, client.code, client.nickname, client.companyName, client.cnpj);
    } else {
      const sql = `UPDATE client SET code = ?, nickname = ?, company_name = ?, cnpj = ? WHERE id = ?`;
      await pool.execute(sql, [client.code, client.nickname, client.companyName, client.cnpj, client.id]);
      return client;
    }
  }

  async findById(id: number): Promise<Client | null> {
    const sql = `SELECT id, code, nickname, company_name, cnpj FROM client WHERE id = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Client(row.id, row.code, row.nickname, row.company_name, row.cnpj);
  }

  async findByCnpj(cnpj: string): Promise<Client | null> {
    const sql = `SELECT id, code, nickname, company_name, cnpj FROM client WHERE cnpj = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [cnpj]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Client(row.id, row.code, row.nickname, row.company_name, row.cnpj);
  }

  async findByCode(code: number): Promise<Client | null> {
    const sql = `SELECT id, code, nickname, company_name, cnpj FROM client WHERE code = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [code]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Client(row.id, row.code, row.nickname, row.company_name, row.cnpj);
  }

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM client WHERE id = ?`;
    await pool.execute(sql, [id]);
  }
  
  async listAll(): Promise<Client[]> {
    const sql = `SELECT id, code, nickname, company_name, cnpj FROM client`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql);

    return rows.map(row => new Client(row.id, row.code, row.nickname, row.company_name, row.cnpj));
  }
}
