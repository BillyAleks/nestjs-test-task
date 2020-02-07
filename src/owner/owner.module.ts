import { Module } from "@nestjs/common";
import { OwnerService } from "./owner.service";
import { OwnerController } from "./owner.controller";
import { Owner } from "./entities/owner.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Owner])],
  exports: [TypeOrmModule],
  providers: [OwnerService],
  controllers: [OwnerController]
})
export class OwnerModule {}
