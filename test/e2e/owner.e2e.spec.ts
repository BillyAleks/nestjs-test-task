import * as request from "supertest";
import delay from "delay";
import { Owner } from "../../src/owner/interfaces/owner.interface";

const url = String(process.env.API_BASE_URL || "http://localhost:3000");
const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let ownersIds: string[];

describe(`ExceptionScenario: url: ${url}`, () => {
    afterAll(async () => {
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
    });
  
    describe("Owner module", () => {
        beforeEach(async () => {
          await delay(500);
        });
        test("POST /owners should return 201", async () => {
          await request(url)
            .post("/owners")
            .send({
              name: "John",
              purchaseDate: now
            })
            .expect(201)
            .then(res => {
              expect(res.body).toEqual({});
            });
        });
    
        test("GET /owners should return 200", async () => {
          await request(url)
            .get(`/owners`)
            .expect(200)
            .then(res => {
              expect(res.body.length).not.toEqual(0);
              ownersIds = [res.body[0].id];
            });
        });
    
        test("PATCH /owners should return 201", async () => {
          await request(url)
            .patch(`/owners/${ownersIds[0]}`)
            .send({
              name: "Jane"
            })
            .expect(201)
            .then(res => {
              expect(res.body).toEqual({});
            });
        });
    
        test("PUT /owners should create owner and return 201", async () => {
          await request(url)
            .put(`/owners/${fakeId}`)
            .send({
              name: "Bill",
              purchaseDate: now
            })
            .expect(201)
            .then(res => {
              expect(res.body).toEqual({});
            });
        });
    
        test("PUT /owners should rewrite extisting owner and return 201", async () => {
          await request(url)
            .put(`/owners/${ownersIds[0]}`)
            .send({
              name: "Bill",
              purchaseDate: now
            })
            .expect(201)
            .then(res => {
              expect(res.body).toEqual({});
            });
        });
    
        test("GET /owners/:id should return 200 and owner entity", async () => {
          await request(url)
            .get(`/owners/${ownersIds[0]}`)
            .expect(200)
            .then(res => {
              expect(res.body.name).toEqual("Bill");
              expect(res.body.id).toEqual(ownersIds[0]);
              expect(res.body.purchaseDate).toBeDefined();
              expect(res.body.createdAt).toBeDefined();
              expect(res.body.updatedAt).toBeDefined();
            });
        });
    
        test("DELETE /owners/:id should delete owner and return 200", async () => {
          await request(url)
            .delete(`/owners/${ownersIds[0]}`)
            .expect(200)
            .then(res => {
              expect(res.body).toEqual({});
            });
          const owners = await request(url).get("/owners");
          ownersIds = [owners.body[0].id];
        });
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
            .send({ name: "test" })
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
  });
  