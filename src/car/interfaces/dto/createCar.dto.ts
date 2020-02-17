import {
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  IsDateString,
  IsArray,
  IsNotEmpty
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Owner } from "../../../owner/entities/owner.entity";

export class CreateCarDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  readonly manufacturerId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty()
  @IsDateString()
  readonly firstRegistrationDate: Date;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  readonly ownersIds: string[];
}
