import * as request from "supertest";
import { Car } from "../src/car/interfaces/car.interface";
import { Manufacturer } from "../src/manufacturer/interfaces/manufacturer.interface";
import { Owner } from "../src/owner/interfaces/owner.interface";
import delay from "delay";

const url = String(process.env.API_BASE_URL || "http://localhost:3000");
const fakeId = "123e4567-e89b-12d3-a456-426655440000";
let ownersIds: string[];
let manufacturerId: string;
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
    test("Should return 404, when there are no owners", async () => {
      await request(url)
        .get(`/owners`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual({
            error: "Not Found",
            message: "Error(404): No owners were found",
            statusCode: 404
          });
        });
    });

    test("Should return 404, when there are no manufacturers", async () => {
      await request(url)
        .get(`/manufacturers`)
        .expect(404)
        .then(res => {
          expect(res.body).toEqual({
            error: "Not Found",
            message: `Error(404): No manufacturers were found`,
            statusCode: 404
          });
        });
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

      await request(url)
        .post(`/cars`)
        .send({
          manufacturerId,
          ownersIds,
          price: 2000,
          firstRegistrationDate: new Date()
        });
      const carsRes = await request(url).get(`/cars`);
      carId = carsRes.body[0].id;
    });

    describe("Owner Exceptions", () => {
      beforeEach(async () => {
        await delay(200);
      });
      test("Should return 404, when there is no owner found by id", async () => {
        await request(url)
          .get(`/owners/${fakeId}`)
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): No owner were found`,
              statusCode: 404
            });
          });
      });

      test("Should return 400, if try to create with name not a string", async () => {
        await request(url)
          .post(`/owners`)
          .send({ name: 777, purchaseDate: new Date() })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create with purchaseDate not a date", async () => {
        await request(url)
          .post(`/owners`)
          .send({ name: "test", purchaseDate: "12.02.2020" })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if there not all required field for owner creation", async () => {
        await request(url)
          .post(`/owners`)
          .send({ name: "test"})
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 404, when there is no owner to update", async () => {
        await request(url)
          .patch(`/owners/${fakeId}`)
          .send({ name: "John" })
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Owner was not found`,
              statusCode: 404
            });
          });
      });

      test("Should return 400, when name is not a string", async () => {
        await request(url)
          .patch(`/owners/${ownersIds[0]}`)
          .send({ name: 777 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when purchaseDate is not date ", async () => {
        await request(url)
          .patch(`/owners/${ownersIds[0]}`)
          .send({ purchaseDate: 777 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when body consists unknown fields", async () => {
        await request(url)
          .patch(`/owners/${ownersIds[0]}`)
          .send({ price: 777 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when there is not correct body to put", async () => {
        await request(url)
          .put(`/owners/${ownersIds[0]}`)
          .expect(400)
          .send({
            name: "test123"
          })
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });

        await request(url)
          .put(`/owners/${fakeId}`)
          .expect(400)
          .send({
            purchaseDate: new Date()
          })
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 404, when there is no owner to delete", async () => {
        await request(url)
          .delete(`/owners/${fakeId}`)
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Owner was not found or been already deleted`,
              statusCode: 404
            });
          });
      });
    });
    describe("Manufacturer Exceptions", () => {
      beforeEach(async () => {
        await delay(200);
      });
      test("Should return 404, when there is no manufacturer found by id", async () => {
        await request(url)
          .get(`/manufacturers/${fakeId}`)
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): No manufacturer were found`,
              statusCode: 404
            });
          });
      });

      test("Should return 400, if try to create with name not a string", async () => {
        await request(url)
          .post(`/manufacturers`)
          .send({ name: 777, phone: "+3806612345678", siret: 12345678901234 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create with phone not a string", async () => {
        await request(url)
          .post(`/manufacturers`)
          .send({ name: "test", phone: 3806612345678, siret: 12345678901234 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create with siret not a number", async () => {
        await request(url)
          .post(`/manufacturers`)
          .send({ name: "test", phone: "3806612345678", siret: "12345678901234" })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if there not all required field for creation", async () => {
        await request(url)
          .post(`/manufacturers`)
          .send({ name: "test", phone: "3806612345678"})
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 404, when there is no manufacturer to update", async () => {
        await request(url)
          .patch(`/manufacturers/${fakeId}`)
          .send({ name: "John" })
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Manufacturer was not found`,
              statusCode: 404
            });
          });
      });

      test("Should return 400, when name is not a string", async () => {
        await request(url)
          .patch(`/manufacturers/${manufacturerId}`)
          .send({ name: 777 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when phone is not a string ", async () => {
        await request(url)
          .patch(`/manufacturers/${manufacturerId}`)
          .send({ phone: 9379992 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when siret is NaN ", async () => {
        await request(url)
          .patch(`/manufacturers/${manufacturerId}`)
          .send({ siret: "93799929379992" })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when body consists unknown fields", async () => {
        await request(url)
          .patch(`/manufacturers/${manufacturerId}`)
          .send({ price: 777 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 400, when there is not correct body to put", async () => {
        await request(url)
          .put(`/manufacturers/${manufacturerId}`)
          .expect(400)
          .send({
            name: "test123"
          })
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });

        await request(url)
          .put(`/manufacturers/${fakeId}`)
          .expect(400)
          .send({
            phone: "370501234567",
            siret: 12345678901234
          })
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 404, when there is no manufacturer to delete", async () => {
        await request(url)
          .delete(`/manufacturers/${fakeId}`)
          .expect(404)
          .then(res => {
            expect(res.body).toEqual({
              error: "Not Found",
              message: `Error(404): Manufacturer was not found or been already deleted`,
              statusCode: 404
            });
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
          .send({ firstRegistrationDate: new Date(), manufacturerId: "1234", ownersIds, price: 2000 })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create with ownersIds not an array", async () => {
        await request(url)
          .post(`/cars`)
          .send({ firstRegistrationDate: new Date(), manufacturerId, ownersIds: fakeId, price: 2000  })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create with ownersIds not not in uuid string format", async () => {
        await request(url)
          .post(`/cars`)
          .send({ firstRegistrationDate: new Date(), manufacturerId, ownersIds: ["1234"], price: 2000  })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create a car with price not a number", async () => {
        await request(url)
          .post(`/cars`)
          .send({ firstRegistrationDate: new Date(), manufacturerId, ownersIds,  price: "2000" })
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual(`Bad Request`);
          });
      });

      test("Should return 400, if try to create a car with first registration date as a string", async () => {
        await request(url)
          .post(`/cars`)
          .send({ firstRegistrationDate: "13.02.2020", manufacturerId, ownersIds,  price: 2000 })
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
          .send({ firstRegistrationDate: new Date(), manufacturerId: fakeId, ownersIds,  price: 2000 })
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
          .send({ firstRegistrationDate: new Date(), manufacturerId, ownersIds: [fakeId],  price: 2000 })
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
          .send({ manufacturerId: "1234"})
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 404, when manufacturerId is not associate with existing manufacturer ", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({ manufacturerId: fakeId})
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
          .send({ ownersIds: ["1234"]})
          .expect(400)
          .then(res => {
            expect(res.body.error).toEqual("Bad Request");
          });
      });

      test("Should return 404, when ownersIds is not associate with existing owners ", async () => {
        await request(url)
          .patch(`/cars/${carId}`)
          .send({ ownersIds: [fakeId]})
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
