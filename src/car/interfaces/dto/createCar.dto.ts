import {
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  IsDateString,
  IsArray,
  IsNotEmpty
} from "class-validator";

export class CreateCarDto {
  @IsString()
  @IsUUID()
  readonly manufacturerId: string;

  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsDateString()
  readonly firstRegistrationDate: Date;

  @IsArray()
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  readonly ownersIds: string[];
}
