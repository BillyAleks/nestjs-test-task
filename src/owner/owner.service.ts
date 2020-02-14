import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Owner as OwnerEntity } from "./entities/owner.entity";
import { Owner } from "./interfaces/owner.interface";
import { CreateOwnerDto } from "./interfaces/dto/createOwner.dto";
import { UpdateOwnerDto } from "./interfaces/dto/updateOwner.dto";

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(OwnerEntity)
    private readonly ownerRepository: Repository<OwnerEntity>
  ) {}

  async findAll(): Promise<Owner[]> {
    const owners = await this.ownerRepository
      .createQueryBuilder("owner")
      .getMany();
    if (owners.length === 0) {
      throw new Error("Error(404): No owners were found");
    }
    return owners;
  }

  async findOne(id: string): Promise<Owner> {
    const owner = await this.ownerRepository.findOne(id);
    if (!owner) {
      throw new Error("Error(404): No owner were found");
    }
    return owner;
  }

  async create(ownerToCreate: CreateOwnerDto): Promise<void> {
    if (!ownerToCreate.name || !ownerToCreate.purchaseDate) {
      throw new Error(
        "Error(400): Bad Request, all required fields should be pointed"
      );
    }
    const owner = this.ownerRepository.create({
      name: ownerToCreate.name,
      purchaseDate: ownerToCreate.purchaseDate
    });
    await this.ownerRepository.save(owner);
  }

  async update(id: string, ownerToUpdate: UpdateOwnerDto): Promise<void> {
    if (!ownerToUpdate.name && !ownerToUpdate.purchaseDate) {
      throw new Error(
        "Error(400): Bad Request, one of required fields should be pointed"
      );
    }
    const owner = await this.ownerRepository.findOne(id);
    if (!owner) {
      throw new Error("Error(404): Owner was not found");
    }
    Object.assign(owner, ownerToUpdate);
    await this.ownerRepository.save(owner);
  }

  async put(id: string, ownerToPut: CreateOwnerDto): Promise<void> {
    if (!ownerToPut.name || !ownerToPut.purchaseDate) {
      throw new Error("Error(400): All fields are required");
    }
    const owner = await this.ownerRepository.findOne(id);
    if (owner) {
      await this.update(id, ownerToPut);
    } else {
      await this.create(ownerToPut);
    }
  }

  async delete(id: string): Promise<void> {
    const owner = await this.ownerRepository.findOne(id);
    if (!owner) {
      throw new Error(
        "Error(404): Owner was not found or been already deleted"
      );
    }
    await this.ownerRepository.delete(id);
  }
}
