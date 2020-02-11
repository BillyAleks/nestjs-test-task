import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  IsDateString,
  IsArray,
  IsNotEmpty
} from "class-validator";

export class UpdateCarDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly manufacturerId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly price?: number;

  @IsOptional()
  @IsDateString()
  readonly firstRegistrationDate?: Date;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  readonly ownersIds?: string[];
}
