import { Test, TestingModule } from "@nestjs/testing";
import { OwnerService } from "./owner.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Owner as OwnerEntity } from "./entities/owner.entity";
import { Owner } from "./interfaces/owner.interface";
import { CreateOwnerDto } from "./interfaces/dto/createOwner.dto";

const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let ownerService: OwnerService;
let ownerRepo: Repository<OwnerEntity>;
let ownersMock: Owner[];
let dtoMock: CreateOwnerDto;

describe("OwnerService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnerService,
        {
          provide: getRepositoryToken(OwnerEntity),
          useClass: Repository
        }
      ]
    }).compile();

    ownersMock = [
      {
        id: "b4ebd41e-6c64-414b-b55a-95895688aad5",
        name: "test",
        purchaseDate: now,
        createdAt: now,
        updatedAt: now
      }
    ];

    dtoMock = {
      name: "Test1",
      purchaseDate: now
    };

    ownerRepo = module.get<Repository<OwnerEntity>>(
      getRepositoryToken(OwnerEntity)
    );
    ownerService = module.get<OwnerService>(OwnerService);
  });

  it("should be defined", () => {
    expect(ownerService).toBeDefined();
  });

  test("should return array of owners", async () => {
    ownerRepo.find = jest.fn(async () => ownersMock);
    const res = await ownerService.findAll();

    expect(res).toEqual(ownersMock);
  });

  test("should fails with error if no owners were found", async () => {
    ownerRepo.find = jest.fn(async () => []);

    await expect(ownerService.findAll()).rejects.toThrowError(
      "Error(404): No owners were found"
    );
  });

  test("should return a owner object", async () => {
    ownerRepo.findOne = jest.fn(async () => ownersMock[0]);

    const res = await ownerService.findOne(ownersMock[0].id);

    expect(res).toEqual(ownersMock[0]);
  });

  test("should fails with error if no owner was found", async () => {
    ownerRepo.findOne = jest.fn(async () => undefined);

    await expect(ownerService.findOne(fakeId)).rejects.toThrowError(
      "Error(404): No owner were found"
    );
  });

  test("ownerRepo function should be called with dtoMock within create method", async () => {
    ownerRepo.create = jest.fn();
    ownerRepo.save = jest.fn();

    await ownerService.create(dtoMock);

    expect(ownerRepo.create).toBeCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        purchaseDate: expect.any(Date)
      })
    );
  });

  test("ownerRepo function should be called with dtoMock within save method", async () => {
    ownerRepo.create = jest.fn(
      () =>
        ({
          id: fakeId,
          name: "test",
          purchaseDate: now,
          createdAt: now,
          updatedAt: now
        } as any)
    );
    ownerRepo.save = jest.fn();

    await ownerService.create(dtoMock);

    expect(ownerRepo.save).toBeCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        purchaseDate: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    );
  });

  test("should fails with error if entity to update is not satisfying by parameters", async () => {
    ownerRepo.findOne = jest.fn(async () => ownersMock[0]);
    ownerRepo.save = jest.fn();

    await expect(
      ownerService.update(ownersMock[0].id, {
        name: undefined,
        purchaseDate: undefined
      })
    ).rejects.toThrowError(
      "Error(400): Bad Request, one of required fields should be pointed"
    );
  });

  test("should fails with error if owner to update was not found", async () => {
    ownerRepo.findOne = jest.fn(async () => undefined);
    ownerRepo.save = jest.fn();

    await expect(
      ownerService.update(ownersMock[0].id, {
        name: "Test1"
      })
    ).rejects.toThrowError("Error(404): Owner was not found");
  });

  test("ownerRepo function should be called with object to update within save method", async () => {
    ownerRepo.findOne = jest.fn(async () => ownersMock[0]);
    ownerRepo.save = jest.fn();

    await ownerService.update(ownersMock[0].id, {
      name: "Test1"
    });

    expect(ownerRepo.save).toBeCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        purchaseDate: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    );
  });

  test("ownerRepo function should follow the way of update owner", async () => {
    ownerRepo.findOne = jest.fn(async () => ownersMock[0]);
    ownerRepo.save = jest.fn();

    await ownerService.put(fakeId, dtoMock);

    expect(ownerRepo.findOne).toBeCalledWith(fakeId);
  });

  test("ownerRepo function should follow the way of create owner", async () => {
    ownerRepo.findOne = jest.fn(async () => undefined);
    ownerRepo.save = jest.fn();
    ownerRepo.create = jest.fn();

    await ownerService.put(fakeId, dtoMock);

    expect(ownerRepo.findOne).toBeCalledTimes(1);
  });

  test("ownerRepo function should be called with id within delete method", async () => {
    ownerRepo.findOne = jest.fn(async () => ownersMock[0]);
    ownerRepo.delete = jest.fn();

    await ownerService.delete(ownersMock[0].id);

    expect(ownerRepo.delete).toBeCalledWith(ownersMock[0].id);
  });

  test("should fails with error if there is no owner to delete", async () => {
    ownerRepo.findOne = jest.fn(async () => undefined);

    await expect(ownerService.delete(fakeId)).rejects.toThrowError(
      "Error(404): Owner was not found or been already deleted"
    );
  });
});
