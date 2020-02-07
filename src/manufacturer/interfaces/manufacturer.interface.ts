import { Car } from "../../cars/interfaces/car.interface";

export class Manufacturer {
  readonly id: string;
  readonly name?: string;
  readonly cars?: Car[];
  readonly phone?: string;
  readonly siret?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    init: Pick<Manufacturer, "id" | "createdAt" | "updatedAt"> & Partial<Manufacturer>
  ) {
    Object.assign(this, init);
    this.id = init.id;
    this.createdAt = init.createdAt;
    this.updatedAt = init.updatedAt;
  }
}