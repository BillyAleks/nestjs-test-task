import { Module } from "@nestjs/common";
import { CarService } from "./car.service";
import { CarController } from "./car.controller";
import { Car } from "./entities/car.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Manufacturer } from "../manufacturer/entities/manufacturer.entity";
import { Owner } from "../owner/entities/owner.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Car, Manufacturer, Owner])],
  exports: [TypeOrmModule],
  providers: [CarService],
  controllers: [CarController]
})
export class CarModule {}
