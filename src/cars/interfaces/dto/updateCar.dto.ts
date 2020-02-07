export interface UpdateCarDto {
  readonly manufacturerId?: string;
  readonly price?: number;
  readonly firstRegistrationDate?: Date;
  readonly ownersIds?: string[];
}
