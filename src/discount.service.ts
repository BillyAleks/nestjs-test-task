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
  @Cron("* * 6 * * 0-6")
  async handleCron() {
    console.log("Discount job has been started");
    const checkTime = moment();
    try {
      const cars = await this.carService.findAll();
      cars.map(car => {
        const diff = checkTime.diff(car.firstRegistrationDate, "month");
        if (diff > 12 && diff < 18) {
          const carPriceUpdated = { price: car.price * 0.8 };
          this.carService.update(car.id, carPriceUpdated);
        }
      });
    } catch (error) {
      if (!error.message.includes("404")) {
        throw new Error();
      }
    }
    try {
      const owners = await this.ownerService.findAll();
      owners.map(owner => {
        const diff = checkTime.diff(owner.purchaseDate, "month");
        if (diff > 18) {
          this.ownerService.delete(owner.id);
        }
      });
    } catch (error) {
      if (!error.message.includes("404")) {
        throw new Error();
      }
    }
    console.log("Discount job has been finished");
  }
}
