import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CarService } from "./car/car.service";
import { OwnerService } from "./owner/owner.service";
import * as moment from "moment";

@Injectable()
export class DiscountService {
  constructor(
    private readonly carService: CarService,
    private readonly ownerService: OwnerService
  ) {}
  @Cron("* * 6 * * 1-7")
  async handleCron() {
    console.log("Discount job has been started");
    const checkTime = moment();
    const cars = await this.carService.findAll();
    cars.map(car => {
      const diff = checkTime.diff(car.firstRegistrationDate, "month");
      if (diff > 12 && diff < 18) {
        const carPriceUpdated = { price: car.price * 0.8 };
        this.carService.update(car.id, carPriceUpdated);
      }
    });
    const owners = await this.ownerService.findAll();
    owners.map(owner => {
      const diff = checkTime.diff(owner.purchaseDate, "month");
      if (diff > 18) {
        this.ownerService.delete(owner.id);
      }
    });
    console.log("Discount job has been finished");
  }
}
