import { IsOptional, IsString, IsNumber, IsNotEmpty } from "class-validator";

export class UpdateManufacturerDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly phone?: string;

  @IsOptional()
  @IsNumber()
  readonly siret?: number;
}
