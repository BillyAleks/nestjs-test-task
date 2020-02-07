import { Module } from "@nestjs/common";
import { CarModule } from "./cars/car.module";
import { ManufacturerModule } from "./manufacturer/manufacturer.module";
import { OwnerModule } from "./owner/owner.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [CarModule, ManufacturerModule, OwnerModule, TypeOrmModule.forRoot()]
})
export class AppModule {}
