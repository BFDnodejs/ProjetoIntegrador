import { IUserRepository } from '../core/interfaces/IUsers';
import { User } from '../core/models/User';
import { pool } from '../adapters/config/config';
import * as bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';

export class UserRepository implements IUserRepository {
  private readonly saltRounds = 10;

  async save(user: User): Promise<User> {
    const passwordHash = await bcrypt.hash(user.passwordHash, this.saltRounds);
    
    if (user.id === null) {
        const sql = `INSERT INTO user (email, password_hash, role) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(sql, [user.email, passwordHash, user.role]);
        const insertId = (result as any).insertId;
        return new User(insertId, user.email, user.passwordHash, user.role as "EMPLOYEE");
    } else {
        const sql = `UPDATE user SET email = ?, password_hash = ? WHERE id = ?`;
        await pool.execute(sql, [user.email, passwordHash, user.id]);
        return user;
    }
  }

  async findById(id: number): Promise<User | null> {
    const sql = `SELECT id, email, password_hash, role FROM user WHERE id = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new User(row.id, row.email, row.password_hash, row.role as "EMPLOYEE");
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT id, email, password_hash, role FROM user WHERE email = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [email]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new User(row.id, row.email, row.password_hash, row.role as "EMPLOYEE");
  }

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM user WHERE id = ?`;
    await pool.execute(sql, [id]);
  }
  
  async listAll(): Promise<User[]> {
    const sql = `SELECT id, email, password_hash, role FROM user`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql);

    return rows.map(row => new User(row.id, row.email, row.password_hash, row.role as "EMPLOYEE"));
  }
}