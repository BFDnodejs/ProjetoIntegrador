export interface IBaseRepository<T> {
  save(entity: T): Promise<T>;
  findById(id: number): Promise<T | null>;
  delete(id: number): Promise<void>;
  listAll(): Promise<T[]>;
}