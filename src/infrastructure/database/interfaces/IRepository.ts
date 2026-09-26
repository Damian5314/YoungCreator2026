// D: generieke repository abstractie — alle concrete repos implementeren dit
// Modules zijn afhankelijk van deze interface, niet van Prisma/SQL direct
export interface IRepository<T, TId = string> {
  findById(id: TId): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: TId): Promise<void>;
}
