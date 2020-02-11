import { Owner } from "../../owner/entities/owner.entity";
import { Manufacturer } from "../../manufacturer/entities/manufacturer.entity";
import {
  IsString,
  IsUUID,
  IsObject,
  IsNumber,
  IsDateString,
  IsArray,
  IsNotEmpty
} from "class-validator";

export class Car {
  @IsString()
  @IsUUID()
  id: string;

  @IsObject()
  manufacturer: Manufacturer;

  @IsNumber()
  price: number;

  @IsDateString()
  firstRegistrationDate: Date;

  @IsArray()
  @IsNotEmpty()
  owners: Owner[];

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
