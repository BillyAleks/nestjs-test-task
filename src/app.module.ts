import { Module } from "@nestjs/common";
import { CarModule } from "./car/car.module";
import { ManufacturerModule } from "./manufacturer/manufacturer.module";
import { OwnerModule } from "./owner/owner.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [CarModule, ManufacturerModule, OwnerModule, TypeOrmModule.forRoot(), ScheduleModule.forRoot()]
})
export class AppModule {}
