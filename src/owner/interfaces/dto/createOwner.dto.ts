import { IsString, IsNotEmpty, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOwnerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly purchaseDate: Date;
}
