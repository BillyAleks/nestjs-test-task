import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Car as CarEntity } from "./entities/car.entity";
import { Manufacturer as ManufacturerEntity } from "../manufacturer/entities/manufacturer.entity";
import { Owner as OwnerEntity } from "../owner/entities/owner.entity";
import { Car } from "./interfaces/car.interface";
import { CreateCarDto } from "./interfaces/dto/createCar.dto";
import { UpdateCarDto } from "./interfaces/dto/updateCar.dto";

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
    @InjectRepository(ManufacturerEntity)
    private readonly manufacturerRepository: Repository<ManufacturerEntity>,
    @InjectRepository(OwnerEntity)
    private readonly ownerRepository: Repository<OwnerEntity>
  ) {}

  async create(carToCreate: CreateCarDto): Promise<void> {
    const manufacturerData = await this.manufacturerRepository.findOne(
      carToCreate.manufacturerId
    );
    const ownersData = await this.ownerRepository.findByIds(
      carToCreate.ownersIds
    );
    if (manufacturerData && ownersData.length > 0) {
      const car = this.carRepository.create({
        manufacturer: manufacturerData,
        price: carToCreate.price,
        firstRegistrationDate: carToCreate.firstRegistrationDate,
        owners: ownersData
      });
      await this.carRepository.save(car);
    }
  }

  async findAll(): Promise<Car[] | undefined> {
    const cars = await this.carRepository.createQueryBuilder("car").getMany();
    return cars;
  }

  async findOne(id: string): Promise<Car | undefined> {
    const car = await this.carRepository.findOne(id);
    return car;
  }

  async update(id: string, car: UpdateCarDto): Promise<void> {
    const carToUpdate = await this.carRepository.findOne(id);
    if (carToUpdate) {
      Object.assign(carToUpdate, car);
      await this.carRepository.save(carToUpdate);
    }
  }

  async delete(id: string): Promise<void> {
    await this.carRepository.delete(id);
  }
}
