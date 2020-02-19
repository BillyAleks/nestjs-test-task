import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Car as CarEntity } from "./entities/car.entity";
import { Manufacturer as ManufacturerEntity } from "../manufacturer/entities/manufacturer.entity";
import { Owner as OwnerEntity } from "../owner/entities/owner.entity";
import { Car } from "./interfaces/car.interface";
import { Manufacturer } from "../manufacturer/interfaces/manufacturer.interface";
import { CreateCarDto } from "./interfaces/dto/createCar.dto";
import { UpdateCarDto } from "./interfaces/dto/updateCar.dto";

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
    @InjectRepository(ManufacturerEntity)
    private readonly manufacturerRepository: Repository<ManufacturerEntity>,
    @InjectRepository(OwnerEntity)
    private readonly ownerRepository: Repository<OwnerEntity>
  ) {}

  async findAll(): Promise<Car[]> {
    const cars = await this.carRepository.find();
    if (cars.length === 0) {
      throw new Error("Error(404): No cars were found");
    }
    return cars;
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository.findOne(id);
    if (!car) {
      throw new Error("Error(404): No car were found");
    }
    return car;
  }

  async findOneManufacturer(id: string): Promise<Manufacturer> {
    const car = await this.carRepository.findOne(id, {
      relations: ["manufacturer"]
    });
    if (!car) {
      throw new Error("Error(404): No car were found");
    }
    return car.manufacturer;
  }

  async create(carToCreate: CreateCarDto): Promise<void> {
    const manufacturerData = await this.manufacturerRepository.findOne(
      carToCreate.manufacturerId
    );
    const ownersData = await this.ownerRepository.findByIds(
      carToCreate.ownersIds
    );
    if (!manufacturerData) {
      throw new Error("Error(404): Such manufacturer was not found");
    } else if (ownersData.length === 0) {
      throw new Error("Error(404): Such owners were not found");
    }
    const car = this.carRepository.create({
      manufacturer: manufacturerData,
      price: carToCreate.price,
      firstRegistrationDate: carToCreate.firstRegistrationDate,
      owners: ownersData
    });
    await this.carRepository.save(car);
  }

  async update(id: string, carToUpdate: UpdateCarDto): Promise<void> {
    if (
      !carToUpdate.firstRegistrationDate &&
      !carToUpdate.manufacturerId &&
      !carToUpdate.ownersIds &&
      !carToUpdate.price
    ) {
      throw new Error(
        "Error(400): Bad Request, one of required fields should be pointed"
      );
    }
    if (carToUpdate.manufacturerId) {
      const manufacturerData = await this.manufacturerRepository.findOne(
        carToUpdate.manufacturerId
      );
      if (!manufacturerData) {
        throw new Error("Error(404): Such manufacturer was not found");
      }
    }
    if (carToUpdate.ownersIds) {
      const ownersData = await this.ownerRepository.findByIds(
        carToUpdate.ownersIds
      );
      if (ownersData.length === 0) {
        throw new Error(`Error(404): Such owners were not found`);
      }
    }
    const car = await this.carRepository.findOne(id);
    if (!car) {
      throw new Error("Error(404): Car was not found");
    }
    Object.assign(car, carToUpdate);
    await this.carRepository.save(car);
  }

  async put(id: string, carToPut: CreateCarDto): Promise<void> {
    const car = await this.carRepository.findOne(id);
    if (car) {
      await this.update(id, carToPut);
    } else {
      await this.create(carToPut);
    }
  }

  async delete(id: string): Promise<void> {
    const car = await this.carRepository.findOne(id);
    if (!car) {
      throw new Error("Error(404): Car was not found or been already deleted");
    }
    await this.carRepository.delete(id);
  }
}
