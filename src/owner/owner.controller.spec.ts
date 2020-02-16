import { Test, TestingModule } from "@nestjs/testing";
import { OwnerController } from "./owner.controller";
import { OwnerService } from "./owner.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Owner } from "./interfaces/owner.interface";
import { CreateOwnerDto } from "./interfaces/dto/createOwner.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";

const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let ownerServiceMock: Partial<OwnerService>;
let ownersMock: Owner[];
let dtoMock: CreateOwnerDto;
let ownerControllerMock: OwnerController;

describe("Owner Controller", () => {
  let controller: OwnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnerController],
      providers: [
        OwnerService,
        {
          provide: getRepositoryToken(Owner),
          useClass: Repository
        }
      ]
    }).compile();

    ownerControllerMock = module.get<OwnerController>(
      OwnerController
    );
    ownerServiceMock = module.get<OwnerService>(
      OwnerService
    );

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

    ownerServiceMock = {
      findAll: jest.fn(async () => ownersMock),
      findOne: jest.fn(async () => ownersMock[0]),
      create: jest.fn(async () => {}),
      put: jest.fn(async () => {}),
      update: jest.fn(async () => {}),
      delete: jest.fn(async () => {})
    };

    ownerControllerMock = new OwnerController(
      ownerServiceMock as OwnerService
    );
  });

  it("should be defined", () => {
    expect(ownerControllerMock).toBeDefined();
  });


  ////////////////////////////////////////////////////////////////////


  test("should return array of owners", async () => {
    const res = await ownerControllerMock.findAll();

    expect(res).toEqual(ownersMock);
  });

  test("should fails with error if no owners were found", async () => {
    ownerServiceMock.findAll = jest.fn(async () => {
      throw new Error();
    });

    await expect(ownerControllerMock.findAll()).rejects.toThrowError(
      NotFoundException
    );
  });

  test("should return a owner object", async () => {
    const res = await ownerControllerMock.findOne(
      ownersMock[0].id
    );

    expect(res).toEqual(ownersMock[0]);
  });

  test("should fails with error if no owner was found", async () => {
    ownerServiceMock.findOne = jest.fn(async () => {
      throw new Error();
    });

    await expect(
      ownerControllerMock.findOne(fakeId)
    ).rejects.toThrowError(NotFoundException);
  });

  test("should fails with error if entity to create is not satisfying by parameters", async () => {
    ownerServiceMock.create = jest.fn(async () => {
      throw new Error("400");
    });

    await expect(
      ownerControllerMock.create(dtoMock)
    ).rejects.toThrowError(BadRequestException);
  });

  test("ownerService function should be called with dtoMock within create method", async () => {
    await ownerControllerMock.create(dtoMock);

    expect(ownerServiceMock.create).toBeCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        purchaseDate: expect.any(Date)
      })
    );
  });

  test("ownerService function should be called with id and dtoMock within put method", async () => {
    await ownerControllerMock.put(fakeId, dtoMock);

    expect(ownerServiceMock.put).toBeCalledWith(
      fakeId,
      expect.objectContaining({
        name: expect.any(String),
        purchaseDate: expect.any(Date)
      })
    );
  });

  test("should fails with error if entity to put is not satisfying by parameters", async () => {
    ownerServiceMock.put = jest.fn(async () => {
      throw new Error("400");
    });

    await expect(
      ownerControllerMock.put(fakeId, dtoMock)
    ).rejects.toThrowError(BadRequestException);
  });

  test("should fails with error if entity to update is not satisfying by parameters", async () => {
    ownerServiceMock.update = jest.fn(async () => {
      throw new Error("400");
    });

    await expect(
      ownerControllerMock.update(ownersMock[0].id, {
        name: "1tseT"
      })
    ).rejects.toThrowError(BadRequestException);
  });

  test("should fails with error if entity to update was not found", async () => {
    ownerServiceMock.update = jest.fn(async () => {
      throw new Error("404");
    });

    await expect(
      ownerControllerMock.update(ownersMock[0].id, {
        name: "1tseT"
      })
    ).rejects.toThrowError(NotFoundException);
  });

  test("ownerService function should be called with id and object to update within update method", async () => {
    await ownerControllerMock.update(ownersMock[0].id, {
      name: "1tseT"
    });

    expect(ownerServiceMock.update).toBeCalledWith(
      ownersMock[0].id,
      expect.objectContaining({
        name: expect.any(String)
      })
    );
  });

  test("ownerService function should be called with id within delete method", async () => {
    await ownerControllerMock.delete(ownersMock[0].id);

    expect(ownerServiceMock.delete).toBeCalledWith(
      ownersMock[0].id
    );
  });

  test("should fails with error if there is no owner to delete", async () => {
    ownerServiceMock.delete = jest.fn(async () => {
      throw new Error("404");
    });

    await expect(
      ownerControllerMock.delete(fakeId)
    ).rejects.toThrowError(NotFoundException);
  });


});
