import app from '../../src/appinit';
import request from 'supertest';

describe('newsletters controller', () => {
  const token = process.env.JWT_TOKEN || '';

  describe('register newsletters', () => {
    it('should return 200 and the user should be registred', async () => {
      const res = await request(app)
        .post('/api/v1/newsletters/register')
        .set('content-type', 'application/json')
        .set('Authorization', token)
        .send({
          name: 'efoo',
          email: 'brightefoo@gmail.com',
        });
      expect(res.status).toBe(200);
    });
  });
});
