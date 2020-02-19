import { Owner } from "../../owner/entities/owner.entity";
import { Manufacturer } from "../../manufacturer/entities/manufacturer.entity";
export class Car {
  id: string;
  manufacturer: Manufacturer;
  price: number;
  firstRegistrationDate: Date;
  owners: Owner[];
  createdAt: Date;
  updatedAt: Date;
}
