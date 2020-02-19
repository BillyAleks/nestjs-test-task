import { Module } from "@nestjs/common";
import { CarModule } from "./car/car.module";
import { ManufacturerModule } from "./manufacturer/manufacturer.module";
import { OwnerModule } from "./owner/owner.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { DiscountService } from "./discount.service";
import { CarService } from "./car/car.service";
import { OwnerService } from "./owner/owner.service";

@Module({
  imports: [
    CarModule,
    ManufacturerModule,
    OwnerModule,
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot()
  ],
  providers: [CarService, OwnerService, DiscountService]
})
export class AppModule {}
