import { Test, TestingModule } from "@nestjs/testing";
import { ManufacturerService } from "./manufacturer.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Manufacturer } from "./interfaces/manufacturer.interface";
import { Manufacturer as ManufacturerEntity } from "./entities/manufacturer.entity";
import { CreateManufacturerDto } from "./interfaces/dto/createManufacturer.dto";
import { Car } from "../car/interfaces/car.interface";

const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let manufacturerService: ManufacturerService;
let manufacturerRepo: Repository<ManufacturerEntity>;
let manufacturersMock: Manufacturer[];
let dtoMock: CreateManufacturerDto;
let carsMock: Car[];

describe("ManufacturerService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManufacturerService,
        {
          provide: getRepositoryToken(ManufacturerEntity),
          useClass: Repository
        }
      ]
    }).compile();

    manufacturersMock = [
      {
        id: "08b4ce7e-41bc-45c1-8611-d72a7b0a216d",
        name: "test",
        phone: "+123456789012",
        cars: carsMock,
        siret: 12345678901234,
        createdAt: now,
        updatedAt: now
      }
    ];

    dtoMock = {
      name: "Test1",
      phone: "+345984585858",
      siret: 12345678901234
    };

    manufacturerRepo = module.get<Repository<ManufacturerEntity>>(
      getRepositoryToken(ManufacturerEntity)
    );
    manufacturerService = module.get<ManufacturerService>(ManufacturerService);
  });

  it("should be defined", () => {
    expect(manufacturerService).toBeDefined();
  });

  test("should return array of manufacturers", async () => {
    manufacturerRepo.find = jest.fn(async () => manufacturersMock);
    const res = await manufacturerService.findAll();

    expect(res).toEqual(manufacturersMock);
  });

  test("should fails with error if no manufacturers were found", async () => {
    manufacturerRepo.find = jest.fn(async () => []);

    await expect(manufacturerService.findAll()).rejects.toThrowError(
      "Error(404): No manufacturers were found"
    );
  });

  test("should return a manufacturer object", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturersMock[0]);

    const res = await manufacturerService.findOne(manufacturersMock[0].id);

    expect(res).toEqual(manufacturersMock[0]);
  });

  test("should fails with error if no manufacturer was found", async () => {
    manufacturerRepo.findOne = jest.fn(async () => undefined);

    await expect(manufacturerService.findOne(fakeId)).rejects.toThrowError(
      "Error(404): No manufacturer were found"
    );
  });

  test("manufacturerRepo function should be called with dtoMock within create method", async () => {
    manufacturerRepo.create = jest.fn();
    manufacturerRepo.save = jest.fn();

    await manufacturerService.create(dtoMock);

    expect(manufacturerRepo.create).toBeCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        phone: expect.any(String),
        siret: expect.any(Number)
      })
    );
  });

  test("manufacturerRepo function should be called with dtoMock within save method", async () => {
    manufacturerRepo.create = jest.fn(
      () =>
        ({
          id: fakeId,
          name: "test",
          cars: [],
          phone: "333031234567",
          siret: 12345678901234,
          createdAt: now,
          updatedAt: now
        } as any)
    );
    manufacturerRepo.save = jest.fn();

    await manufacturerService.create(dtoMock);

    expect(manufacturerRepo.save).toBeCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        phone: expect.any(String),
        siret: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    );
  });

  test("should fails with error if entity to update is not satisfying by parameters", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturersMock[0]);
    manufacturerRepo.save = jest.fn();

    await expect(
      manufacturerService.update(manufacturersMock[0].id, {
        name: undefined,
        phone: undefined,
        siret: undefined
      })
    ).rejects.toThrowError(
      "Error(400): Bad Request, one of required fields should be pointed"
    );
  });

  test("should fails with error if manufacturer to update was not found", async () => {
    manufacturerRepo.findOne = jest.fn(async () => undefined);
    manufacturerRepo.save = jest.fn();

    await expect(
      manufacturerService.update(manufacturersMock[0].id, {
        siret: 43210987654321
      })
    ).rejects.toThrowError("Error(404): Manufacturer was not found");
  });

  test("manufacturerRepo function should be called with object to update within save method", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturersMock[0]);
    manufacturerRepo.save = jest.fn();

    await manufacturerService.update(manufacturersMock[0].id, {
      siret: 43210987654321
    });

    expect(manufacturerRepo.save).toBeCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        phone: expect.any(String),
        siret: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    );
  });

  test("manufacturerRepo function should follow the way of update manufacturer", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturersMock[0]);
    manufacturerRepo.save = jest.fn();

    await manufacturerService.put(fakeId, dtoMock);

    expect(manufacturerRepo.findOne).toBeCalledWith(fakeId);
  });

  test("manufacturerRepo function should follow the way of create manufacturer", async () => {
    manufacturerRepo.findOne = jest.fn(async () => undefined);
    manufacturerRepo.save = jest.fn();
    manufacturerRepo.create = jest.fn();

    await manufacturerService.put(fakeId, dtoMock);

    expect(manufacturerRepo.findOne).toBeCalledTimes(1);
  });

  test("manufacturerRepo function should be called with id within delete method", async () => {
    manufacturerRepo.findOne = jest.fn(async () => manufacturersMock[0]);
    manufacturerRepo.delete = jest.fn();

    await manufacturerService.delete(manufacturersMock[0].id);

    expect(manufacturerRepo.delete).toBeCalledWith(manufacturersMock[0].id);
  });

  test("should fails with error if there is no manufacturer to delete", async () => {
    manufacturerRepo.findOne = jest.fn(async () => undefined);

    await expect(manufacturerService.delete(fakeId)).rejects.toThrowError(
      "Error(404): Manufacturer was not found or been already deleted"
    );
  });
});
