import { Car } from "../../car/interfaces/car.interface";
import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsArray,
  IsPhoneNumber,
  IsInt,
  IsDateString
} from "class-validator";

export class Manufacturer {
  @IsUUID()
  @IsString()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsArray()
  readonly cars: Car[];

  @IsString()
  @IsPhoneNumber("ZZ")
  readonly phone: string;

  @IsInt()
  readonly siret: number;

  @IsDateString()
  readonly createdAt: Date;

  @IsDateString()
  readonly updatedAt: Date;
}
