import { Module } from "@nestjs/common";
import { CarsService } from "./car.service";
import { CarController } from "./car.controller";
import { Car } from "./entities/car.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ManufacturerModule } from "../manufacturer/manufacturer.module";
import { OwnerModule } from "../owner/owner.module";
import { Manufacturer } from "../manufacturer/entities/manufacturer.entity";
import { Owner } from "../owner/entities/owner.entity";

@Module({
  imports: [
    ManufacturerModule,
    OwnerModule,
    TypeOrmModule.forFeature([Car, Manufacturer, Owner])
  ],
  providers: [CarsService],
  controllers: [CarController]
})
export class CarModule {}
