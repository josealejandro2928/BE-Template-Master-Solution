const app = require('../src/app');
const seedDb = require("../scripts/seedDb");
const request = require('supertest')


function extractContractInformation(contract) {
  return contract.map((item) => ({ id: item.id, ClientId: item.ClientId, "status": item.status, terms: item.terms }));
}

describe("Contract", () => {
  let server;

  beforeAll(async () => {
    server = app.listen(3001, () => {
      console.log("*******STARTING*********")
    });
    await seedDb();
  });

  afterAll(async () => {
    console.log("*******ENDING*********")
    server.close();
  });

  describe('should not get any contract when no profile_id', () => {
    let result = [];
    beforeAll(async () => {
      result = await request(app).get('/contracts');
    });

    it('Expected 401 listing contract', async () => {
      expect(result.statusCode).toBe(401);
    });

  });

  describe('should get the contract for userId = 1', () => {
    let result;
    beforeAll(async () => {
      result = await request(app).get('/contracts').set("profile_id", 1);
    });

    it('Expected 200 listing contract', async () => {
      expect(result.statusCode).toBe(200);
      expect(result.body.length).toBe(1);
    });
    it('Expected the contracts for user = 1', async () => {
      let contracts = [{
        "id": 2,
        "terms": "bla bla bla",
        "status": "in_progress",
        "updatedAt": "2022-12-26T14:14:44.122Z",
        "ContractorId": 6,
        "ClientId": 1
      }];
      expect(extractContractInformation(result.body)).toEqual(extractContractInformation(contracts));
    });
  });

  describe("Should list contract by id", () => {
    it("get 404 for wrong ID", async () => {
      let result = await request(app).get("/contracts/45").set("profile_id", 1);
      expect(result.statusCode).toBe(404)
    })

    it("get 403 for contractID that does not belongs with user", async () => {
      let result = await request(app).get("/contracts/1").set("profile_id", 2);
      expect(result.statusCode).toBe(403)
    })
    it("get 200 for correct contractId and user", async () => {
      let result = await request(app).get("/contracts/1").set("profile_id", 1);
      expect(result.statusCode).toBe(200)
    })

  })

});
