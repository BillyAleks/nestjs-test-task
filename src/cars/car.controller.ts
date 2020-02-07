import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { CarsService } from "./car.service";
import { Car } from "./interfaces/car.interface";
import { UpdateCarDto } from "./interfaces/dto/updateCar.dto";
import { CreateCarDto } from "./interfaces/dto/createCar.dto";

@Controller("cars")
export class CarController {
  constructor(private readonly carService: CarsService) {}

  @Post()
  async create(@Body() createCarDto: CreateCarDto): Promise<void> {}

  @Get()
  async findAll(): Promise<Car[]> {
    return [];
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<string> {
    return "Hello";
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updateCatDto: UpdateCarDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return `This action removes a #${id} cat`;
  }
}
