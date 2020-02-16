import { Test, TestingModule } from "@nestjs/testing";
import { ManufacturerController } from "./manufacturer.controller";
import { ManufacturerService } from "./manufacturer.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Manufacturer } from "./interfaces/manufacturer.interface";
import { Car } from "../car/interfaces/car.interface";
import { CreateManufacturerDto } from "./interfaces/dto/createManufacturer.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";

const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let manufacturerServiceMock: Partial<ManufacturerService>;
let manufacturersMock: Manufacturer[];
let dtoMock: CreateManufacturerDto;
let manufacturerControllerMock: ManufacturerController;
let carsMock: Car[];

describe("Manufacturer Controller", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturerController],
      providers: [
        ManufacturerService,
        {
          provide: getRepositoryToken(Manufacturer),
          useClass: Repository
        }
      ]
    }).compile();

    manufacturerControllerMock = module.get<ManufacturerController>(
      ManufacturerController
    );
    manufacturerServiceMock = module.get<ManufacturerService>(
      ManufacturerService
    );

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

    manufacturerServiceMock = {
      findAll: jest.fn(async () => manufacturersMock),
      findOne: jest.fn(async () => manufacturersMock[0]),
      create: jest.fn(async () => {}),
      put: jest.fn(async () => {}),
      update: jest.fn(async () => {}),
      delete: jest.fn(async () => {})
    };

    manufacturerControllerMock = new ManufacturerController(
      manufacturerServiceMock as ManufacturerService
    );
  });

  it("should be defined", () => {
    expect(manufacturerControllerMock).toBeDefined();
  });

  test("should return array of manufacturers", async () => {
    const res = await manufacturerControllerMock.findAll();

    expect(res).toEqual(manufacturersMock);
  });

  test("should fails with error if no manufacturers were found", async () => {
    manufacturerServiceMock.findAll = jest.fn(async () => {
      throw new Error();
    });

    await expect(manufacturerControllerMock.findAll()).rejects.toThrowError(
      NotFoundException
    );
  });

  test("should return a manufacturer object", async () => {
    const res = await manufacturerControllerMock.findOne(
      manufacturersMock[0].id
    );

    expect(res).toEqual(manufacturersMock[0]);
  });

  test("should fails with error if no manufacturer was found", async () => {
    manufacturerServiceMock.findOne = jest.fn(async () => {
      throw new Error();
    });

    await expect(
      manufacturerControllerMock.findOne(fakeId)
    ).rejects.toThrowError(NotFoundException);
  });

  test("should fails with error if entity to create is not satisfying by parameters", async () => {
    manufacturerServiceMock.create = jest.fn(async () => {
      throw new Error("400");
    });

    await expect(
      manufacturerControllerMock.create(dtoMock)
    ).rejects.toThrowError(BadRequestException);
  });

  test("manufacturerService function should be called with dtoMock within create method", async () => {
    await manufacturerControllerMock.create(dtoMock);

    expect(manufacturerServiceMock.create).toBeCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        phone: expect.any(String),
        siret: expect.any(Number)
      })
    );
  });

  test("manufacturerService function should be called with id and dtoMock within put method", async () => {
    await manufacturerControllerMock.put(fakeId, dtoMock);

    expect(manufacturerServiceMock.put).toBeCalledWith(
      fakeId,
      expect.objectContaining({
        name: expect.any(String),
        phone: expect.any(String),
        siret: expect.any(Number)
      })
    );
  });

  test("should fails with error if entity to put is not satisfying by parameters", async () => {
    manufacturerServiceMock.put = jest.fn(async () => {
      throw new Error("400");
    });

    await expect(
      manufacturerControllerMock.put(fakeId, dtoMock)
    ).rejects.toThrowError(BadRequestException);
  });

  test("should fails with error if entity to update is not satisfying by parameters", async () => {
    manufacturerServiceMock.update = jest.fn(async () => {
      throw new Error("400");
    });

    await expect(
      manufacturerControllerMock.update(manufacturersMock[0].id, {
        siret: 43210987654321
      })
    ).rejects.toThrowError(BadRequestException);
  });

  test("should fails with error if entity to update was not found", async () => {
    manufacturerServiceMock.update = jest.fn(async () => {
      throw new Error("404");
    });

    await expect(
      manufacturerControllerMock.update(manufacturersMock[0].id, {
        siret: 43210987654321
      })
    ).rejects.toThrowError(NotFoundException);
  });

  test("manufacturerService function should be called with id and object to update within update method", async () => {
    await manufacturerControllerMock.update(manufacturersMock[0].id, {
      siret: 43210987654321
    });

    expect(manufacturerServiceMock.update).toBeCalledWith(
      manufacturersMock[0].id,
      expect.objectContaining({
        siret: expect.any(Number)
      })
    );
  });

  test("manufacturerService function should be called with id within delete method", async () => {
    await manufacturerControllerMock.delete(manufacturersMock[0].id);

    expect(manufacturerServiceMock.delete).toBeCalledWith(
      manufacturersMock[0].id
    );
  });

  test("should fails with error if there is no manufacturer to delete", async () => {
    manufacturerServiceMock.delete = jest.fn(async () => {
      throw new Error("404");
    });

    await expect(
      manufacturerControllerMock.delete(fakeId)
    ).rejects.toThrowError(NotFoundException);
  });
});
