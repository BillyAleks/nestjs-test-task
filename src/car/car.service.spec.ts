import { Test, TestingModule } from "@nestjs/testing";
import { CarService } from "./car.service";
import { Repository, SelectQueryBuilder } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Car } from "./entities/car.entity";
import { Manufacturer } from "../manufacturer/entities/manufacturer.entity";
import { Owner } from "../owner/entities/owner.entity";
import { CreateCarDto } from "./interfaces/dto/createCar.dto";

const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let carServiceMock: CarService;
let carRepoMock: Partial<Repository<Car>>;
let manufacturerRepoMock: Partial<Repository<Manufacturer>>;
let ownerRepoMock: Partial<Repository<Owner>>;
let manufacturerMock: Manufacturer;
let carMock: Car;
let carsMock: Car[];
let ownersMock: Owner[];
let dtoMock: CreateCarDto;

describe("CarService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    carMock = {
      id: "5c431318-8699-4f2f-930c-6cb7263489c9",
      manufacturer: manufacturerMock,
      owners: ownersMock,
      price: 5000,
      firstRegistrationDate: now,
      createdAt: now,
      updatedAt: now
    };

    carsMock = [...carMock];

    dtoMock = {
      manufacturerId: "08b4ce7e-41bc-45c1-8611-d72a7b0a216d",
      ownersIds: ["b4ebd41e-6c64-414b-b55a-95895688aad5"],
      price: 9000,
      firstRegistrationDate: now
    };

    carRepoMock = {
      find: jest.fn(async () => carsMock),
      findOne: jest.fn(async () => carsMock[0]),
      create: jest.fn(() => carsMock[0])
    };

    manufacturerRepoMock = {
      findOne: jest.fn(async () => manufacturerMock)
    };

    ownerRepoMock = {
      findByIds: jest.fn(async () => ownersMock)
    };

    carControllerMock = new CarController(carServiceMock as CarService);
  });

  it("should be defined", () => {
    expect(carServiceMock).toBeDefined();
  });

  // test("should return array of cars", async () => {
  //   const res = await carControllerMock.findAll();

  //   expect(res).toEqual(carsMock);
  // });

  // test("should fails with error if no cars were found", async () => {
  //   carServiceMock.findAll = jest.fn(async () => {
  //     throw new Error();
  //   });

  //   await expect(carControllerMock.findAll()).rejects.toThrowError(
  //     NotFoundException
  //   );
  // });

  // test("should return a car object", async () => {
  //   const res = await carControllerMock.findOne(carsMock[0].id);

  //   expect(res).toEqual(carsMock[0]);
  // });

  // test("should fails with error if no car was found", async () => {
  //   await expect(carControllerMock.findOne(fakeId)).rejects.toThrowError(
  //     NotFoundException
  //   );
  // });

  // test("should return a manufacturer object", async () => {
  //   const res = await carControllerMock.findOneManufacturer(carsMock[0].id);

  //   expect(res).toEqual(manufacturerMock);
  // });

  // test("should fails with error if no car was found", async () => {
  //   await expect(
  //     carControllerMock.findOneManufacturer(fakeId)
  //   ).rejects.toThrowError(NotFoundException);
  // });

  // test("should fails with error if entity to create is not satisfying", async () => {
  //   carServiceMock.create = jest.fn(async () => {
  //     throw new Error("400");
  //   });

  //   await expect(carControllerMock.create(dtoMock)).rejects.toThrowError(
  //     BadRequestException
  //   );
  // });

  // test("carService function should be called with dtoMock within create method", async () => {
  //   await carControllerMock.create(dtoMock);

  //   expect(carServiceMock.create).toBeCalledWith(
  //     expect.objectContaining({
  //       manufacturerId: expect.any(String),
  //       ownersIds: expect.any([String]),
  //       price: expect.any(Number),
  //       firstRegistrationDate: expect.any(Date)
  //     })
  //   );
  // });
});
