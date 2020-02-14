import { Test, TestingModule } from "@nestjs/testing";
import { CarController } from "./car.controller";
import { CarService } from "./car.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Car } from "./interfaces/car.interface";
import { Manufacturer } from "../manufacturer/entities/manufacturer.entity";
import { Owner } from "../owner/entities/owner.entity";
import { CreateCarDto } from "./interfaces/dto/createCar.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";

const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let carServiceMock: Partial<CarService>;
let carsMock: Car[];
let manufacturerMock: Manufacturer;
let ownersMock: Owner[];
let dtoMock: CreateCarDto;
let carControllerMock: CarController;

describe("Car Controller", () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        CarService,
        {
          provide: getRepositoryToken(Car),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Manufacturer),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Owner),
          useClass: Repository
        }
      ]
    }).compile();

    carControllerMock = module.get<CarController>(CarController);
    carServiceMock = module.get<CarService>(CarService);

    manufacturerMock = {
      id: "08b4ce7e-41bc-45c1-8611-d72a7b0a216d",
      name: "test",
      phone: "+123456789012",
      cars: carsMock,
      siret: 12345678901234,
      createdAt: now,
      updatedAt: now
    };

    ownersMock = [
      {
        id: "b4ebd41e-6c64-414b-b55a-95895688aad5",
        name: "test",
        purchaseDate: now,
        createdAt: now,
        updatedAt: now
      }
    ];

    carsMock = [
      {
        id: "5c431318-8699-4f2f-930c-6cb7263489c9",
        manufacturer: manufacturerMock,
        owners: ownersMock,
        price: 5000,
        firstRegistrationDate: now,
        createdAt: now,
        updatedAt: now
      }
    ];

    dtoMock = {
      manufacturerId: "08b4ce7e-41bc-45c1-8611-d72a7b0a216d",
      ownersIds: ["b4ebd41e-6c64-414b-b55a-95895688aad5"],
      price: 9000,
      firstRegistrationDate: now
    };

    carServiceMock = {
      findAll: jest.fn(async () => carsMock),
      findOne: jest.fn(async () => carsMock[0]),
      findOneManufacturer: jest.fn(async () => manufacturerMock),
      create: jest.fn(async () => {}),
      put: jest.fn(async () => {}),
      update: jest.fn(async () => {}),
      delete: jest.fn(async () => {})
    };

    carControllerMock = new CarController(carServiceMock as CarService);
  });

  test("should be defined", () => {
    expect(carControllerMock).toBeDefined();
  });

  test("should return array of cars", async () => {
    const res = await carControllerMock.findAll();

    expect(res).toEqual(carsMock);
  });

  test("should fails with error if no cars were found", async () => {
    carServiceMock.findAll = jest.fn(async () => {
      throw new Error();
    });

    await expect(carControllerMock.findAll()).rejects.toThrowError(
      NotFoundException
    );
  });

  test("should return a car object", async () => {
    const res = await carControllerMock.findOne(carsMock[0].id);

    expect(res).toEqual(carsMock[0]);
  });

  test("should fails with error if no car was found", async () => {
    carServiceMock.findOne = jest.fn(async () => {
      throw new Error();
    });

    await expect(carControllerMock.findOne(fakeId)).rejects.toThrowError(
      NotFoundException
    );
  });

  test("should return a manufacturer object", async () => {
    const res = await carControllerMock.findOneManufacturer(carsMock[0].id);

    expect(res).toEqual(manufacturerMock);
  });

  test("should fails with error if no car was found", async () => {
    carServiceMock.findOneManufacturer = jest.fn(async () => {
      throw new Error();
    });

    await expect(
      carControllerMock.findOneManufacturer(fakeId)
    ).rejects.toThrowError(NotFoundException);
  });

  test("should fails with error if entity to create is not satisfying by parameters", async () => {
    carServiceMock.create = jest.fn(async () => {
      throw new Error("400");
    });

    await expect(carControllerMock.create(dtoMock)).rejects.toThrowError(
      BadRequestException
    );
  });

  test("carService function should be called with dtoMock within create method", async () => {
    await carControllerMock.create(dtoMock);

    expect(carServiceMock.create).toBeCalledWith(
      expect.objectContaining({
        manufacturerId: expect.any(String),
        ownersIds: expect.any(Array),
        price: expect.any(Number),
        firstRegistrationDate: expect.any(Date)
      })
    );
  });

  test("should fails with error if manufacturer or owners are impossible to find", async () => {
    carServiceMock.create = jest.fn(async () => {
      throw new Error("404");
    });

    await expect(carControllerMock.create(dtoMock)).rejects.toThrowError(
      NotFoundException
    );
  });

  test("carService function should be called with id and dtoMock within put method", async () => {
    await carControllerMock.put(fakeId, dtoMock);

    expect(carServiceMock.put).toBeCalledWith(
      fakeId,
      expect.objectContaining({
        manufacturerId: expect.any(String),
        ownersIds: expect.any(Array),
        price: expect.any(Number),
        firstRegistrationDate: expect.any(Date)
      })
    );
  });

  test("should fails with error if entity to put is not satisfying by parameters", async () => {
    carServiceMock.put = jest.fn(async () => {
      throw new Error("400");
    });

    await expect(carControllerMock.put(fakeId, dtoMock)).rejects.toThrowError(
      BadRequestException
    );
  });

  test("should fails with error if entity to update is not satisfying by parameters", async () => {
    carServiceMock.update = jest.fn(async () => {
      throw new Error("400");
    });

    await expect(
      carControllerMock.update(carsMock[0].id, { price: 1000 })
    ).rejects.toThrowError(BadRequestException);
  });

  test("carService function should be called with id and object with price key within update method", async () => {
    await carControllerMock.update(carsMock[0].id, { price: 1000 });

    expect(carServiceMock.update).toBeCalledWith(
      carsMock[0].id,
      expect.objectContaining({
        price: expect.any(Number)
      })
    );
  });

  test("should fails with error if manufacturer or owners are impossible to find", async () => {
    carServiceMock.update = jest.fn(async () => {
      throw new Error("404");
    });

    await expect(
      carControllerMock.update(carsMock[0].id, { price: 1000 })
    ).rejects.toThrowError(NotFoundException);
  });

  test("carService function should be called with id within delete method", async () => {
    await carControllerMock.delete(carsMock[0].id);

    expect(carServiceMock.delete).toBeCalledWith(carsMock[0].id);
  });

  test("should fails with error if there is no car to delete", async () => {
    carServiceMock.delete = jest.fn(async () => {
      throw new Error("404");
    });

    await expect(carControllerMock.delete(fakeId)).rejects.toThrowError(
      NotFoundException
    );
  });
});
