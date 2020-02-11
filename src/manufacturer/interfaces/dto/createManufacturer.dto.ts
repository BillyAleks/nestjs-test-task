import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateManufacturerDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsNumber()
  readonly siret: number;
}
