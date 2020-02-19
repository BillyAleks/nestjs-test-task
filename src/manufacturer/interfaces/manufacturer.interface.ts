import { Car } from "../../car/interfaces/car.interface";

export class Manufacturer {
  readonly id: string;
  readonly name: string;
  readonly cars: Car[];
  readonly phone: string;
  readonly siret: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
