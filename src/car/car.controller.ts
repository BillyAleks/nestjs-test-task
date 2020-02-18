import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  NotFoundException,
  BadRequestException
} from "@nestjs/common";
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse
} from "@nestjs/swagger";

import { CarService } from "./car.service";
import { Car } from "./interfaces/car.interface";
import { Manufacturer } from "../manufacturer/interfaces/manufacturer.interface";
import { UpdateCarDto } from "./interfaces/dto/updateCar.dto";
import { CreateCarDto } from "./interfaces/dto/createCar.dto";

@ApiTags("cars")
@Controller("cars")
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async findAll(): Promise<Car[]> {
    try {
      const cars = await this.carService.findAll();
      return cars;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(":id")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async findOne(@Param("id") id: string): Promise<Car> {
    try {
      const car = await this.carService.findOne(id);
      return car;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(":id/manufacturer")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async findOneManufacturer(@Param("id") id: string): Promise<Manufacturer> {
    try {
      const manufacturer = await this.carService.findOneManufacturer(id);
      return manufacturer;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(@Body() createCarDto: CreateCarDto): Promise<void> {
    try {
      await this.carService.create(createCarDto);
    } catch (error) {
      if (error.message.includes("404")) {
        throw new NotFoundException(error.message);
      } else throw new BadRequestException(error.message);
    }
  }

  @Put(":id")
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @HttpCode(201)
  async put(
    @Param("id") id: string,
    @Body() putCarDto: CreateCarDto
  ): Promise<void> {
    try {
      await this.carService.put(id, putCarDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(":id")
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(201)
  async update(
    @Param("id") id: string,
    @Body() updateCarDto: UpdateCarDto
  ): Promise<void> {
    try {
      await this.carService.update(id, updateCarDto);
    } catch (error) {
      if (error.message.includes("404")) {
        throw new NotFoundException(error.message);
      } else throw new BadRequestException(error.message);
    }
  }

  @Delete(":id")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async delete(@Param("id") id: string): Promise<void> {
    try {
      await this.carService.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
