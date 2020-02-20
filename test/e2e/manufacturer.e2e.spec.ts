import * as request from "supertest";
import delay from "delay";
import { Car } from "../../src/car/interfaces/car.interface";
import { Manufacturer } from "../../src/manufacturer/interfaces/manufacturer.interface";

const url = String(process.env.API_BASE_URL || "http://localhost:3000");
const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let manufacturerId: string;

describe(`ExceptionScenario: url: ${url}`, () => {
  afterAll(async () => {
    const { body: manufacturersToDelete } = await request(url).get(
      `/manufacturers`
    );
    manufacturersToDelete.map(
      async (manufacturer: Manufacturer) =>
        await request(url).delete(`/manufacturers/${manufacturer.id}`)
    );
  });
  describe("Empty Tables Exeptions", () => {
    beforeEach(async () => {
      await delay(200);
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
  });

  describe("Manufacturer module", () => {
    beforeEach(async () => {
      await delay(500);
    });
    test("POST /manufacturer should create manufacturer and return 201", async () => {
      const res = await request(url)
        .post("/manufacturers")
        .send({
          name: "General Motors",
          phone: "+470661234567",
          siret: 12345678901234
        })
        .expect(201);
      expect(res.body).toEqual({});
    });

    test("GET /manufacturers should return array of manufacturers and status 200", async () => {
      await request(url)
        .get(`/manufacturers`)
        .expect(200)
        .then(res => {
          expect(res.body.length).not.toEqual(0);
          manufacturerId = res.body[0].id;
        });
    });

    test("PATCH /manufacturers should update manufacturer and return 201", async () => {
      await request(url)
        .patch(`/manufacturers/${manufacturerId}`)
        .send({
          name: "Zhiguli Saloon"
        })
        .expect(201)
        .then(res => {
          expect(res.body).toEqual({});
        });
    });

    test("PUT /manufacturers should rewrite extisting manufacturer and return 201", async () => {
      await request(url)
        .put(`/manufacturers/${manufacturerId}`)
        .send({
          name: "Ferrari Inc",
          phone: "+690441234567",
          siret: 43210987654321
        })
        .expect(201)
        .then(res => {
          expect(res.body).toEqual({});
        });
    });

    test("PUT /manufacturers should create manufacturer and return 201", async () => {
      await request(url)
        .put(`/manufacturers/${fakeId}`)
        .send({
          name: "Ferrari Inc",
          phone: "+690441234567",
          siret: 43210987654321
        })
        .expect(201)
        .then(res => {
          expect(res.body).toEqual({});
        });
    });

    test("GET /manufacturers/:id should return 200 and manufacturer entity", async () => {
      await request(url)
        .get(`/manufacturers/${manufacturerId}`)
        .expect(200)
        .then(res => {
          expect(res.body.name).toEqual("Ferrari Inc");
          expect(res.body.id).toEqual(manufacturerId);
          expect(res.body.phone).toEqual("+690441234567");
          expect(res.body.siret).toEqual("43210987654321");
          expect(res.body.cars).not.toBeDefined();
          expect(res.body.createdAt).toBeDefined();
          expect(res.body.updatedAt).toBeDefined();
        });
    });

    test("DELETE /manufacturers/:id should delete manufacturer and return 200", async () => {
      await request(url)
        .delete(`/manufacturers/${manufacturerId}`)
        .expect(200)
        .then(res => {
          expect(res.body).toEqual({});
        });
      const manufacturers = await request(url).get("/manufacturers");
      manufacturerId = manufacturers.body[0].id;
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
        .send({
          name: "test",
          phone: "3806612345678",
          siret: "12345678901234"
        })
        .expect(400)
        .then(res => {
          expect(res.body.error).toEqual(`Bad Request`);
        });
    });

    test("Should return 400, if there not all required field for creation", async () => {
      await request(url)
        .post(`/manufacturers`)
        .send({ name: "test", phone: "3806612345678" })
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
});
