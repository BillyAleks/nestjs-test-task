import { IsOptional, IsString, IsNumber, IsNotEmpty } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateManufacturerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly siret?: number;
}
