import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDateString
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateOwnerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly purchaseDate?: Date;
}
