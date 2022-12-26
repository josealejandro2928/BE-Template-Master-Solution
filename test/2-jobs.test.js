const app = require('../src/app');
const seedDb = require("../scripts/seedDb");
const request = require('supertest')
const mockData = require("./__test__/mock");

function extractJobInformation(jobs) {
  return jobs.map((item) => (
    {
      id: item.id,
      description: item.description,
      paid: item.paid,
      price: item.price,
      paymentDate: item.paymentDate,
      ContractId: item.ContractId
    }));
}

describe("Jobs", () => {
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

  describe('should get the correct jobs for user 1', () => {
    let result;
    beforeAll(async () => {
      result = await request(app).get('/jobs/unpaid').set("profile_id", 1);
    });

    it('Expected 200 listing contract', async () => {
      expect(result.statusCode).toBe(200);
    });
    it('Expected listing contract for profile_id = 1', async () => {
      expect(extractJobInformation(result.body)).toEqual(extractJobInformation(mockData[1].unpaidJobs));
    });

  });
 
});
