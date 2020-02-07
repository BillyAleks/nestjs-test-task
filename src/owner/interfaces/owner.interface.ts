export class Owner {
  readonly id: string;
  readonly name?: string;
  readonly purchaseDate?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    init: Pick<Owner, "id" | "createdAt" | "updatedAt"> & Partial<Owner>
  ) {
    Object.assign(this, init);
    this.id = init.id;
    this.createdAt = init.createdAt;
    this.updatedAt = init.updatedAt;
  }
}
