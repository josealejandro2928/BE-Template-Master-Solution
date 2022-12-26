const app = require('../src/app');
const seedDb = require("../scripts/seedDb");
const request = require('supertest')

describe("Admin", () => {
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

  describe('should get the correct best profession for the correct date', () => {
    let result;
    beforeAll(async () => {
      result = await request(app).get('/admin/best-profession?start=2020-01-01&end=2022-12-31');
    });

    it('Expected 200 listing best Profession', async () => {
      expect(result.statusCode).toBe(200);
    });
    it('Expected listing contract for profile_id = 1', async () => {
      expect(result.body.bestProfession).toEqual("Programmer");
    });

  });

  describe('should get the anything for past dates', () => {
    let result;
    beforeAll(async () => {
      result = await request(app).get('/admin/best-profession?start=2018-01-01&end=2022-19-31');
    });

    it('Expected 200 listing best Profession', async () => {
      expect(result.statusCode).toBe(200);
    });
    it('Expected listing anything', async () => {
      expect(result.body.bestProfession).toEqual("There is not data in that range dates");
    });

  });

  describe('should get the correct list for best-clients', () => {
    let result;
    beforeAll(async () => {
      result = await request(app).get('/admin/best-clients?start=2020-01-01&end=2022-12-26');
    });

    it('Expected 200 listing best Profession', async () => {
      expect(result.statusCode).toBe(200);
    });
    it('Expected correct limit', async () => {
      expect(result.body.length).toBe(2);
    });
    it('Expected correct best client for the correct set', async () => {
      expect(result.body[0].fullName).toBe("Ash Kethcum");
    });
  

  });
 
});
