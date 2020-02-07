export interface CreateCarDto {
  readonly manufacturerId: string;
  readonly price: number;
  readonly firstRegistrationDate: Date;
  readonly ownersIds: string[];
}
