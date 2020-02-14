import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Manufacturer as ManufacturerEntity } from "./entities/manufacturer.entity";
import { Manufacturer } from "./interfaces/manufacturer.interface";
import { CreateManufacturerDto } from "./interfaces/dto/createManufacturer.dto";
import { UpdateManufacturerDto } from "./interfaces/dto/updateManufacturer.dto";

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(ManufacturerEntity)
    private readonly manufacturerRepository: Repository<ManufacturerEntity>
  ) {}

  async findAll(): Promise<Manufacturer[]> {
    const manufacturers = await this.manufacturerRepository
      .createQueryBuilder("manufacturer")
      .getMany();
    if (manufacturers.length === 0) {
      throw new Error("Error(404): No manufacturers were found");
    }
    return manufacturers;
  }

  async findOne(id: string): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne(id);
    if (!manufacturer) {
      throw new Error("Error(404): No manufacturer were found");
    }
    return manufacturer;
  }

  async create(manufacturerToCreate: CreateManufacturerDto): Promise<void> {
    if (
      !manufacturerToCreate.name ||
      !manufacturerToCreate.phone ||
      !manufacturerToCreate.siret
    ) {
      throw new Error(
        "Error(400): Bad Request, all required fields should be pointed"
      );
    }
    const manufacturer = this.manufacturerRepository.create({
      name: manufacturerToCreate.name,
      phone: manufacturerToCreate.phone,
      siret: manufacturerToCreate.siret
    });
    await this.manufacturerRepository.save(manufacturer);
  }

  async update(
    id: string,
    manufacturerToUpdate: UpdateManufacturerDto
  ): Promise<void> {
    if (
      !manufacturerToUpdate.name &&
      !manufacturerToUpdate.phone &&
      !manufacturerToUpdate.siret
    ) {
      throw new Error(
        "Error(400): Bad Request, one of required fields should be pointed"
      );
    }
    const manufacturer = await this.manufacturerRepository.findOne(id);
    if (!manufacturer) {
      throw new Error("Error(404): Manufacturer was not found");
    }
    Object.assign(manufacturer, manufacturerToUpdate);
    await this.manufacturerRepository.save(manufacturer);
  }

  async put(
    id: string,
    manufacturerToPut: CreateManufacturerDto
  ): Promise<void> {
    if (
      !manufacturerToPut.name ||
      !manufacturerToPut.phone ||
      !manufacturerToPut.siret
    ) {
      throw new Error("Error(400): All fields are required");
    }
    const manufacturer = await this.manufacturerRepository.findOne(id);
    if (manufacturer) {
      this.update(id, manufacturerToPut);
    } else {
      this.create(manufacturerToPut);
    }
  }

  async delete(id: string): Promise<void> {
    const manufacturer = await this.manufacturerRepository.findOne(id);
    if (!manufacturer) {
      throw new Error(
        "Error(404): Manufacturer was not found or been already deleted"
      );
    }
    await this.manufacturerRepository.delete(id);
  }
}

