import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a sign up request', () => {
    const signUpEmail = 'test@test.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: signUpEmail, password: 'test' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(signUpEmail);
      });
  });

  it('sign up as a new user then get the currently logged in user', async () => {
    const signUpEmail = 'test@test.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: signUpEmail, password: 'test' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(signUpEmail);
  });
});
