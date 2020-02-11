import * as request from "supertest";
import delay from "delay";

const url = String(process.env.API_BASE_URL || "http://localhost:3000");
const now = new Date();
const fakeId = "123e4567-e89b-12d3-a456-426655440000";

let manufacturerId: string;
let ownersIds: string[];

// const manufacturerToCreateMock = {
//   name: "General Motors",
//   phone: "+470661234567",
//   siret: 12345678901234
// };
// const manufacturerToUpdateMock = {
//   name: "Zhiguli Saloon"
// };
// const carToCreateMock = {
//   manufacturerId,
//   ownersIds,
//   price: 5000,
//   firstRegistrationDate: now
// };
// const carToUpdateMock = {
//   price: 6000
// };

describe(`NormalScenario: url: ${url}`, () => {
  describe("Owner module", () => {
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
  ///////////////////////////////////////////////////////////////////////////////////////
  describe("Manufacturer module", () => {
    beforeEach(async () => {
      await delay(1000);
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
});

