import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDateString
} from "class-validator";

export class UpdateOwnerDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @IsDateString()
  readonly purchaseDate?: Date;
}
