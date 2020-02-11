import { IsString, IsNotEmpty, IsDateString} from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDateString()
  readonly purchaseDate: Date;
}
