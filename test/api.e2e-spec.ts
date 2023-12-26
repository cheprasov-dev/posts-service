import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { DatabaseService } from '../src/database/database.service';

import { AppModule } from './../src/app.module';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlckdyb3VwcyI6WzEsMiwzLDQsNV19.ziK_sLT-wqa3AtREjLpM8deMxPI8mbww8UwPlBvdrfo';

const TOKEN_WITHOUT_GROUPS =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlckdyb3VwcyI6W119.NKtd_FLkDgReXIucPxLTqDMlRZhSk2clUdiDmhml428';

describe('API Controller (e2e)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
  });

  afterEach(async () => {
    await databaseService.query('DELETE FROM comments');
    await databaseService.query('DELETE FROM posts');
  });

  describe('POST /posts', () => {
    it('positive case', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          text: 'someText',
          groupId: 1,
        });

      delete response.body.id;
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        commentsCount: 0,
        createdBy: 1,
        groupId: 1,
        text: 'someText',
      });
    });

    it('check validator - type', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          text: 123,
          groupId: 'fdgfd',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: [
          'groupId must be a number conforming to the specified constraints',
          'text must be a string',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    it('check validator - empty body', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          text: 123,
          groupId: 'fdgfd',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: [
          'groupId must be a number conforming to the specified constraints',
          'text must be a string',
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    it('token without group', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${TOKEN_WITHOUT_GROUPS}`)
        .send({
          text: 'someText',
          groupId: 1,
        });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: 'You cannot create posts in this group',
        statusCode: 403,
      });
    });

    it('without token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({
          text: 'someText',
          groupId: 1,
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });
  });

  describe('GET /posts', () => {
    it('positive case', async () => {
      const queryString = `
        INSERT INTO
        posts (text, group_id, created_by)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const values = ['someText', 1, 1];

      const result = await databaseService.query(queryString, values);
      await databaseService.query(queryString, values);

      const queryStringInsertComment = `
          INSERT INTO
          comments (text, post_id, created_by)
          VALUES
            ('someText', ${result.rows[0].id}, 1),
            ('someText', ${result.rows[0].id}, 1),
            ('someText', ${result.rows[0].id}, 1),
            ('someText', ${result.rows[0].id}, 1),
            ('someText', ${result.rows[0].id}, 1);
        `;

      await databaseService.query(queryStringInsertComment);

      const response = await request(app.getHttpServer())
        .get('/api/v1/posts/?groupId=1')
        .set('Authorization', `Bearer ${TOKEN}`);

      expect(response.status).toBe(200);
      expect(
        response.body
          .map((elem: any) => {
            delete elem.id;
            return elem;
          })
          .sort((a: any, b: any) => a.commentsCount - b.commentsCount),
      ).toEqual([
        { commentsCount: 0, createdBy: 1, text: 'someText' },
        { commentsCount: 5, createdBy: 1, text: 'someText' },
      ]);
    });

    it('check validator', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/posts/?groupId=qwe')
        .set('Authorization', `Bearer ${TOKEN}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: [
          'groupId must be a number conforming to the specified constraints',
        ],
        statusCode: 400,
      });
    });

    it('token without group', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/posts/?groupId=1')
        .set('Authorization', `Bearer ${TOKEN_WITHOUT_GROUPS}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: 'This group is not available to you',
        statusCode: 403,
      });
    });

    it('without token', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/posts');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });
  });

  describe('POST /posts/:id/comments', () => {
    it('positive case', async () => {
      const queryString = `
        INSERT INTO
        posts (text, group_id, created_by)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const values = ['someText', 1, 1];

      const result = await databaseService.query(queryString, values);

      const response = await request(app.getHttpServer())
        .post(`/api/v1/posts/${result.rows[0].id}/comments`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          text: 'someText',
          groupId: 1,
        });

      delete response.body.id;
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        createdBy: 1,
        text: 'someText',
      });
    });

    it('check validator - type', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/posts/1/comments`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          text: 1234,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: ['text must be a string'],
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    it('token without group', async () => {
      const queryString = `
        INSERT INTO
        posts (text, group_id, created_by)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const values = ['someText', 1, 1];

      const result = await databaseService.query(queryString, values);

      const response = await request(app.getHttpServer())
        .post(`/api/v1/posts/${result.rows[0].id}/comments`)
        .set('Authorization', `Bearer ${TOKEN_WITHOUT_GROUPS}`)
        .send({
          text: 'someText',
          groupId: 1,
        });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: 'You cannot create posts in this group',
        statusCode: 403,
      });
    });

    it('without token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts/1/comments')
        .send({
          text: 'someText',
          groupId: 1,
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('with the unknown post id', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts/123451/comments')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          text: 'someText',
          groupId: 1,
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Post not found',
        statusCode: 404,
      });
    });
  });

  describe('GET /posts/:id/comments', () => {
    it('positive case', async () => {
      const queryString = `
        INSERT INTO
        posts (text, group_id, created_by)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const values = ['someText', 1, 1];

      const result = await databaseService.query(queryString, values);

      const queryStringInsertComment = `
        INSERT INTO
        comments (text, post_id, created_by)
        VALUES
          ('someText', ${result.rows[0].id}, 1),
          ('someText', ${result.rows[0].id}, 1),
          ('someText', ${result.rows[0].id}, 1),
          ('someText', ${result.rows[0].id}, 1),
          ('someText', ${result.rows[0].id}, 1)
      `;

      await databaseService.query(queryStringInsertComment);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/posts/${result.rows[0].id}/comments`)
        .set('Authorization', `Bearer ${TOKEN}`);

      expect(response.status).toBe(200);
      expect(
        response.body.map((elem: any) => {
          delete elem.id;
          return elem;
        }),
      ).toEqual([
        { text: 'someText', createdBy: 1 },
        { text: 'someText', createdBy: 1 },
        { text: 'someText', createdBy: 1 },
        { text: 'someText', createdBy: 1 },
        { text: 'someText', createdBy: 1 },
      ]);
    });

    it('token without group', async () => {
      const queryString = `
        INSERT INTO
        posts (text, group_id, created_by)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const values = ['someText', 1, 1];

      const result = await databaseService.query(queryString, values);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/posts/${result.rows[0].id}/comments`)
        .set('Authorization', `Bearer ${TOKEN_WITHOUT_GROUPS}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: 'You cannot read comments on posts in this group.',
        statusCode: 403,
      });
    });

    it('without token', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/v1/posts/1/comments',
      );

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('with the unknown post id', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/posts/123451/comments')
        .set('Authorization', `Bearer ${TOKEN}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Post not found',
        statusCode: 404,
      });
    });
  });
});
