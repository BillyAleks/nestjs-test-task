import { IsString, IsUUID, IsNotEmpty, IsDateString } from "class-validator";

export class Owner {
  @IsString()
  @IsUUID()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDateString()
  readonly purchaseDate: Date;

  @IsDateString()
  readonly createdAt: Date;

  @IsDateString()
  readonly updatedAt: Date;
}
