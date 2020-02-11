import { Module } from "@nestjs/common";
import { ManufacturerService } from "./manufacturer.service";
import { ManufacturerController } from "./manufacturer.controller";
import { Manufacturer } from "./entities/manufacturer.entity";
import { Car } from "../car/entities/car.entity";
import { Owner } from "../owner/entities/owner.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer, Car, Owner])],
  exports: [TypeOrmModule],
  providers: [ManufacturerService],
  controllers: [ManufacturerController]
})
export class ManufacturerModule {}
