import { Module } from "@nestjs/common";
import { OwnerService } from "./owner.service";
import { OwnerController } from "./owner.controller";
import { Owner } from "./entities/owner.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Manufacturer } from "../manufacturer/entities/manufacturer.entity";
import { Car } from "../car/entities/car.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Owner, Car, Manufacturer])],
  exports: [TypeOrmModule],
  providers: [OwnerService],
  controllers: [OwnerController]
})
export class OwnerModule {}
