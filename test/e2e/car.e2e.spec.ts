import * as request from "supertest";
import delay from "delay";
import { Car } from "../../src/car/interfaces/car.interface";
import { Manufacturer } from "../../src/manufacturer/interfaces/manufacturer.interface";
import { Owner } from "../../src/owner/interfaces/owner.interface";

const url = String(process.env.API_BASE_URL || "http://localhost:3000");
const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let manufacturerId: string;
let ownersIds: string[];
let carId: string;

describe(`ExceptionScenario: url: ${url}`, () => {
  afterAll(async () => {
    const { body: carsToDelete } = await request(url).get(`/cars`);
    carsToDelete.map(
      async (car: Car) => await request(url).delete(`/cars/${car.id}`)
    );

    const { body: manufacturersToDelete } = await request(url).get(
      `/manufacturers`
    );
    manufacturersToDelete.map(
      async (manufacturer: Manufacturer) =>
        await request(url).delete(`/manufacturers/${manufacturer.id}`)
    );

    const { body: ownersToDelete } = await request(url).get(`/owners`);
    ownersToDelete.map(
      async (owner: Owner) => await request(url).delete(`/owners/${owner.id}`)
    );
  });
  describe("Empty Tables Exeptions", () => {
    beforeEach(async () => {
      await delay(200);
    });

    test("Should return 404, when there are no cars", async () => {
      await request(url)
        .get(`/cars`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual({
            error: "Not Found",
            message: `Error(404): No cars were found`,
            statusCode: 404
          });
        });
    });
  });

  describe("Data Exceptions", () => {
    beforeAll(async () => {
      await request(url)
        .post(`/owners`)
        .send({ name: "test", purchaseDate: new Date() });
      const ownersRes = await request(url).get(`/owners`);
      ownersIds = [ownersRes.body[0].id];

      await request(url)
        .post(`/manufacturers`)
        .send({ name: "test", phone: "+123456789012", siret: 12345678901234 });
      const manufacturersRes = await request(url).get(`/manufacturers`);
      manufacturerId = manufacturersRes.body[0].id;
    });

    describe("Car module", () => {
      beforeEach(async () => {
        await delay(500);
      });
      test("POST /cars should return 201", async () => {
        await request(url)
          .post("/cars")
          .send({
            manufacturerId,
            ownersIds,
            price: 5000,
            firstRegistrationDate: now
          })
          .expect(201)
          .then(res => {
            expect(res.body).toEqual({});
          });
      });

      test("GET /cars should return 200", async () => {
        await request(url)
          .get(`/cars`)
          .expect(200)
          .then(res => {
            expect(res.body.length).not.toEqual(0);
            carId = res.body[0].id;
          });
      });

      test("PATCH /cars should return 201", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({
            price: 4000
          })
          .expect(201)
          .then(res => {
            expect(res.body).toEqual({});
          });
      });

      test("PUT /cars should create car and return 201", async () => {
        await request(url)
          .put(`/cars/${fakeId}`)
          .send({
            manufacturerId,
            ownersIds,
            price: 10000,
            firstRegistrationDate: new Date()
          })
          .expect(201)
          .then(res => {
            expect(res.body).toEqual({});
          });
      });

      test("PUT /cars should rewrite extisting cars and return 201", async () => {
        await request(url)
          .put(`/cars/${carId}`)
          .send({
            manufacturerId,
            ownersIds,
            price: 10000,
            firstRegistrationDate: new Date()
          })
          .expect(201)
          .then(res => {
            expect(res.body).toEqual({});
          });
      });

      test("GET /cars/:id/manufacturer should return 200 and manufacturer entity related to the car", async () => {
        await request(url)
          .get(`/cars/${carId}/manufacturer`)
          .expect(200)
          .then(res => {
            expect(res.body.name).toEqual("test");
            expect(res.body.id).toEqual(manufacturerId);
            expect(res.body.phone).toEqual("+123456789012");
            expect(res.body.siret).toEqual("12345678901234");
            expect(res.body.cars).not.toBeDefined();
            expect(res.body.createdAt).toBeDefined();
            expect(res.body.updatedAt).toBeDefined();
          });
      });

      test("GET /cars/:id should return 200 and cars entity", async () => {
        await request(url)
          .get(`/cars/${carId}`)
          .expect(200)
          .then(res => {
            expect(res.body.id).toEqual(carId);
            expect(res.body.price).toEqual(10000);
            expect(res.body.firstRegistrationDate).toBeDefined();
            expect(res.body.createdAt).toBeDefined();
            expect(res.body.updatedAt).toBeDefined();
          });
      });

      test("DELETE /cars/:id should delete owner and return 200", async () => {
        await request(url)
          .delete(`/cars/${carId}`)
          .expect(200)
          .then(res => {
            expect(res.body).toEqual({});
          });
      });
    });

    describe("Car Exceptions", () => {
      beforeEach(async () => {
        await delay(200);
      });
      test("Should return 404, when there is no car found by id", async () => {
        await request(url)
          .get(`/cars/${fakeId}`)
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): No car were found`,
              statusCode: 404
            });
          });
      });

      test("Should return 404, when there is no car found in search of manufacturer through car api", async () => {
        await request(url)
          .get(`/cars/${fakeId}/manufacturer`)
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): No car were found`,
              statusCode: 404
            });
          });
      });

      test("Should return 400, if try to create with manufacturerI not in uuid string format", async () => {
        await request(url)
          .post(`/cars`)
          .send({
            firstRegistrationDate: new Date(),
            manufacturerId: "1234",
            ownersIds,
            price: 2000
          })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create with ownersIds not an array", async () => {
        await request(url)
          .post(`/cars`)
          .send({
            firstRegistrationDate: new Date(),
            manufacturerId,
            ownersIds: fakeId,
            price: 2000
          })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create with ownersIds not not in uuid string format", async () => {
        await request(url)
          .post(`/cars`)
          .send({
            firstRegistrationDate: new Date(),
            manufacturerId,
            ownersIds: ["1234"],
            price: 2000
          })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create a car with price not a number", async () => {
        await request(url)
          .post(`/cars`)
          .send({
            firstRegistrationDate: new Date(),
            manufacturerId,
            ownersIds,
            price: "2000"
          })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create a car with first registration date as a string", async () => {
        await request(url)
          .post(`/cars`)
          .send({
            firstRegistrationDate: "13.02.2020",
            manufacturerId,
            ownersIds,
            price: 2000
          })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if there not all required field for creation", async () => {
        await request(url)
          .post(`/cars`)
          .send({ manufacturerId, ownersIds, price: 5000 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 404, trying to create with not existing manufacturer", async () => {
        await request(url)
          .post(`/cars`)
          .send({
            firstRegistrationDate: new Date(),
            manufacturerId: fakeId,
            ownersIds,
            price: 2000
          })
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Such manufacturer was not found`,
              statusCode: 404
            });
          });
      });

      test("Should return 404, trying to create with not existing owners", async () => {
        await request(url)
          .post(`/cars`)
          .send({
            firstRegistrationDate: new Date(),
            manufacturerId,
            ownersIds: [fakeId],
            price: 2000
          })
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Such owners were not found`,
              statusCode: 404
            });
          });
      });

      test("Should return 404, when there is no car found to update", async () => {
        await request(url)
          .patch(`/cars/${fakeId}`)
          .send({ price: 9000 })
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Car was not found`,
              statusCode: 404
            });
          });
      });

      test("Should return 400, when firstRegistrationDate is not a date", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({ firstRegistrationDate: "17.10.2000" })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when price is not a number ", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({ price: "2000" })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when manufacturerId is not in uuid string format ", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({ manufacturerId: "1234" })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 404, when manufacturerId is not associate with existing manufacturer ", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({ manufacturerId: fakeId })
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Such manufacturer was not found`,
              statusCode: 404
            });
          });
      });

      test("Should return 400, when ownersIds is not in uuid string format ", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({ ownersIds: ["1234"] })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 404, when ownersIds is not associate with existing owners ", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({ ownersIds: [fakeId] })
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Such owners were not found`,
              statusCode: 404
            });
          });
      });

      test("Should return 400, when body consists unknown fields", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({ carNumber: 777 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when there is not correct body to put", async () => {
        await request(url)
          .put(`/cars/${carId}`)
          .expect(400)
          .send({
            manufacturerId,
            ownersIds
          })
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });

        await request(url)
          .put(`/cars/${fakeId}`)
          .expect(400)
          .send({
            manufacturerId,
            ownersIds,
            price: 12000
          })
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 404, when there is no car found to delete", async () => {
        await request(url)
          .delete(`/cars/${fakeId}`)
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Car was not found or been already deleted`,
              statusCode: 404
            });
          });
      });
    });
  });
});
