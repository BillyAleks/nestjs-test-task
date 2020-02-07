import { Owner } from "../../owner/entities/owner.entity";
import { Manufacturer } from "../../manufacturer/entities/manufacturer.entity";

export interface Car {
  id: string;
  manufacturer: Manufacturer;
  price: number;
  firstRegistrationDate: Date;
  owners: Owner[];
  createdAt: Date;
  updatedAt: Date;

  // constructor(init: Car) {
  //   Object.assign(this, init);
  //   this.id = init.id;
  //   this.manufacturer = init.manufacturer;
  //   this.price = init.price;
  //   this.firstRegistrationDate = init.firstRegistrationDate;
  //   this.owners = init.owners;
  //   this.createdAt = init.createdAt;
  //   this.updatedAt = init.updatedAt;
  // }
}
