import { Module } from "@nestjs/common";
import { ManufacturerService } from "./manufacturer.service";
import { ManufacturerController } from "./manufacturer.controller";
import { Manufacturer } from "./entities/manufacturer.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer])],
  exports: [TypeOrmModule],
  providers: [ManufacturerService],
  controllers: [ManufacturerController]
})
export class ManufacturerModule {}
