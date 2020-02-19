import { Test, TestingModule } from "@nestjs/testing";
import { CarService } from "./car.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Car } from "./interfaces/car.interface";
import { Manufacturer } from "../manufacturer/interfaces/manufacturer.interface";
import { Owner } from "../owner/interfaces/owner.interface";
import { Car as CarEntity } from "./entities/car.entity";
import { Manufacturer as ManufacturerEntity } from "../manufacturer/entities/manufacturer.entity";
import { Owner as OwnerEntity } from "../owner/entities/owner.entity";
import { CreateCarDto } from "./interfaces/dto/createCar.dto";

const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let carService: CarService;
let carRepo: Repository<CarEntity>;
let manufacturerRepo: Repository<ManufacturerEntity>;
let ownerRepo: Repository<OwnerEntity>;
let manufacturerMock: Manufacturer;
let carsMock: Car[];
let ownersMock: Owner[];
let dtoMock: CreateCarDto;

describe("CarService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getRepositoryToken(CarEntity),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(ManufacturerEntity),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(OwnerEntity),
          useClass: Repository
        }
      ]
    }).compile();

    carService = module.get<CarService>(CarService);
    carRepo = module.get<Repository<CarEntity>>(getRepositoryToken(CarEntity));
    manufacturerRepo = module.get<Repository<ManufacturerEntity>>(
      getRepositoryToken(ManufacturerEntity)
    );
    ownerRepo = module.get<Repository<OwnerEntity>>(
      getRepositoryToken(OwnerEntity)
    );

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
  });

  it("should be defined", () => {
    expect(carService).toBeDefined();
  });

  test("should return array of cars", async () => {
    carRepo.find = jest.fn(async () => carsMock);
    const res = await carService.findAll();

    expect(res).toEqual(carsMock);
  });

  test("should fails with error if no cars were found", async () => {
    carRepo.find = jest.fn(async () => []);

    await expect(carService.findAll()).rejects.toThrowError(
      "Error(404): No cars were found"
    );
  });

  test("should return a car object", async () => {
    carRepo.findOne = jest.fn(async () => carsMock[0]);

    const res = await carService.findOne(carsMock[0].id);

    expect(res).toEqual(carsMock[0]);
  });

  test("should fails with error if no car was found", async () => {
    carRepo.findOne = jest.fn(async () => undefined);

    await expect(carService.findOne(fakeId)).rejects.toThrowError(
      "Error(404): No car were found"
    );
  });

  test("should return a manufacturer object", async () => {
    carRepo.findOne = jest.fn(async () => carsMock[0]);
    const res = await carService.findOneManufacturer(carsMock[0].id);

    expect(res).toEqual(manufacturerMock);
  });

  test("should fails with error if no car was found", async () => {
    carRepo.findOne = jest.fn(async () => undefined);

    await expect(carService.findOneManufacturer(fakeId)).rejects.toThrowError(
      "Error(404): No car were found"
    );
  });

  test("should fails with error if no manufacturer was found", async () => {
    manufacturerRepo.findOne = jest.fn(async () => undefined);
    ownerRepo.findByIds = jest.fn(async () => ownersMock);

    await expect(carService.create(dtoMock)).rejects.toThrowError(
      "Error(404): Such manufacturer was not found"
    );
  });

  test("should fails with error if no owners were found", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturerMock);
    ownerRepo.findByIds = jest.fn(async () => []);

    await expect(carService.create(dtoMock)).rejects.toThrowError(
      "Error(404): Such owners were not found"
    );
  });

  test("carRepo function should be called with dtoMock within create method", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturerMock);
    ownerRepo.findByIds = jest.fn(async () => ownersMock);
    carRepo.create = jest.fn();
    carRepo.save = jest.fn();

    await carService.create(dtoMock);

    expect(carRepo.create).toBeCalledWith(
      expect.objectContaining({
        manufacturer: expect.any(Object),
        owners: expect.any(Array),
        price: expect.any(Number),
        firstRegistrationDate: expect.any(Date)
      })
    );
  });

  test("carRepo function should be called with dtoMock within save method", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturerMock);
    ownerRepo.findByIds = jest.fn(async () => ownersMock);
    carRepo.create = jest.fn(
      () =>
        ({
          id: fakeId,
          manufacturer: manufacturerMock,
          price: 5000,
          firstRegistrationDate: now,
          owners: ownersMock,
          createdAt: now,
          updatedAt: now
        } as any)
    );
    carRepo.save = jest.fn();

    await carService.create(dtoMock);

    expect(carRepo.save).toBeCalledTimes(1);
  });

  test("should fails with error if entity to update is not satisfying by parameters", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturerMock);
    ownerRepo.findByIds = jest.fn(async () => ownersMock);
    carRepo.findOne = jest.fn(async () => carsMock[0]);
    carRepo.save = jest.fn();

    await expect(
      carService.update(carsMock[0].id, {
        firstRegistrationDate: undefined,
        manufacturerId: undefined,
        ownersIds: undefined,
        price: undefined
      })
    ).rejects.toThrowError(
      "Error(400): Bad Request, one of required fields should be pointed"
    );
  });

  test("should fails with error if no manufacturer was found", async () => {
    manufacturerRepo.findOne = jest.fn(async () => undefined);
    ownerRepo.findByIds = jest.fn(async () => ownersMock);
    carRepo.findOne = jest.fn();
    carRepo.save = jest.fn();

    await expect(
      carService.update(carsMock[0].id, {
        manufacturerId: dtoMock.manufacturerId
      })
    ).rejects.toThrowError("Error(404): Such manufacturer was not found");
  });

  test("should fails with error if no owners were found", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturerMock);
    ownerRepo.findByIds = jest.fn(async () => []);
    carRepo.findOne = jest.fn();
    carRepo.save = jest.fn();

    await expect(
      carService.update(carsMock[0].id, {
        ownersIds: dtoMock.ownersIds
      })
    ).rejects.toThrowError("Error(404): Such owners were not found");
  });

  test("should fails with error if car to update was not found", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturerMock);
    ownerRepo.findByIds = jest.fn(async () => ownersMock);
    carRepo.findOne = jest.fn(async () => undefined);
    carRepo.save = jest.fn();

    await expect(
      carService.update(carsMock[0].id, {
        price: 7500
      })
    ).rejects.toThrowError("Error(404): Car was not found");
  });

  test("carRepo function should be called with object to update within save method", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturerMock);
    ownerRepo.findByIds = jest.fn(async () => ownersMock);
    carRepo.findOne = jest.fn(async () => carsMock[0]);
    carRepo.save = jest.fn();

    await carService.update(carsMock[0].id, {
      price: 7500
    });

    expect(carRepo.save).toBeCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        manufacturer: expect.any(Object),
        price: expect.any(Number),
        firstRegistrationDate: expect.any(Date),
        owners: expect.any(Array),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    );
  });

  test("carRepo function should follow the way of update car", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturerMock);
    ownerRepo.findByIds = jest.fn(async () => ownersMock);
    carRepo.findOne = jest.fn(async () => carsMock[0]);
    carRepo.save = jest.fn();

    await carService.put(fakeId, dtoMock);

    expect(carRepo.findOne).toBeCalledWith(fakeId);
  });

  test("carRepo function should follow the way of create car", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturerMock);
    ownerRepo.findByIds = jest.fn(async () => ownersMock);
    carRepo.findOne = jest.fn(async () => undefined);
    carRepo.save = jest.fn();
    carRepo.create = jest.fn();

    await carService.put(fakeId, dtoMock);

    expect(carRepo.findOne).toBeCalledTimes(1);
  });

  test("carRepo function should be called with id within delete method", async () => {
    carRepo.findOne = jest.fn(async () => carsMock[0]);
    carRepo.delete = jest.fn();

    await carService.delete(carsMock[0].id);

    expect(carRepo.delete).toBeCalledWith(carsMock[0].id);
  });

  test("should fails with error if there is no car to delete", async () => {
    carRepo.findOne = jest.fn(async () => undefined);

    await expect(carService.delete(fakeId)).rejects.toThrowError(
      "Error(404): Car was not found or been already deleted"
    );
  });
});
