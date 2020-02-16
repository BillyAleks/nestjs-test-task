import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException
} from "@nestjs/common";
import { OwnerService } from "./owner.service";
import { CreateOwnerDto } from "./interfaces/dto/createOwner.dto";
import { UpdateOwnerDto } from "./interfaces/dto/updateOwner.dto";
import { Owner } from "./entities/owner.entity";

@Controller("owners")
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get()
  async findAll(): Promise<Owner[]> {
    try {
      const owners = await this.ownerService.findAll();
      return owners;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Owner> {
    try {
      const owner = await this.ownerService.findOne(id);
      return owner;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createOwnerDto: CreateOwnerDto): Promise<void> {
    try {
      await this.ownerService.create(createOwnerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(":id")
  @HttpCode(201)
  async put(
    @Param("id") id: string,
    @Body() putOwnerDto: CreateOwnerDto
  ): Promise<void> {
    try {
      await this.ownerService.put(id, putOwnerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(":id")
  @HttpCode(201)
  async update(
    @Param("id") id: string,
    @Body() updateOwnerDto: UpdateOwnerDto
  ): Promise<void> {
    try {
      await this.ownerService.update(id, updateOwnerDto);
    } catch (error) {
      if (error.message.includes("404")) {
        throw new NotFoundException(error.message);
      } else 
      throw new BadRequestException(error.message);
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    try {
      await this.ownerService.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
