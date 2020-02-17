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
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCarDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly manufacturerId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly price?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  readonly firstRegistrationDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  readonly ownersIds?: string[];
}
