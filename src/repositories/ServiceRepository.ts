import { IServiceRepository } from '../core/interfaces/IService';
import { Service } from '../core/models/Service';
import { pool } from '../adapters/config/config';
import { RowDataPacket } from 'mysql2';

export class ServiceRepository implements IServiceRepository {

  async save(service: Service): Promise<Service> {
    if (service.id === null) {
      const sql = `INSERT INTO service (name, code, default_price) VALUES (?, ?, ?)`;
      const [result] = await pool.execute(sql, [service.name, service.code, service.defaultPrice]);
      const insertId = (result as any).insertId;
      return new Service(insertId, service.name, service.code, service.defaultPrice);
    } else {
      const sql = `UPDATE service SET name = ?, code = ?, default_price = ? WHERE id = ?`;
      await pool.execute(sql, [service.name, service.code, service.defaultPrice, service.id]);
      return service;
    }
  }

  async findById(id: number): Promise<Service | null> {
    const sql = `SELECT id, name, code, default_price FROM service WHERE id = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Service(row.id, row.name, row.code, row.default_price);
  }

  async findByCode(code: string): Promise<Service | null> {
    const sql = `SELECT id, name, code, default_price FROM service WHERE code = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [code]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Service(row.id, row.name, row.code, row.default_price);
  }

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM service WHERE id = ?`;
    await pool.execute(sql, [id]);
  }

  async listAll(): Promise<Service[]> {
    const sql = `SELECT id, name, code, default_price FROM service`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql);

    return rows.map(row => new Service(row.id, row.name, row.code, row.default_price));
  }
}
