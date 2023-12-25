import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('API Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/posts (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.E6Ca1gtqCCuDDVRW3b_22CCECjJ6unQ0H0Zo4j_22TE',
      );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  it('/posts?groupId= (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts?groupId=1')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.E6Ca1gtqCCuDDVRW3b_22CCECjJ6unQ0H0Zo4j_22TE',
      );

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('posts/:id/comments (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/comments')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.E6Ca1gtqCCuDDVRW3b_22CCECjJ6unQ0H0Zo4j_22TE',
      );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  it('/posts/:id/comments (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts/:id/comments')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.E6Ca1gtqCCuDDVRW3b_22CCECjJ6unQ0H0Zo4j_22TE',
      );

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
