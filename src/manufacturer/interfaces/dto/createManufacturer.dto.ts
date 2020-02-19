import { IsString, IsNumber, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManufacturerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly siret: number;
}
