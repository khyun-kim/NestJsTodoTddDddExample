import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TodoController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/todo (POST)', () => {
    it('성공: 새로운 할 일을 생성하고 201을 반환해야 한다', async () => {
      return request(app.getHttpServer())
        .post('/api/todo')
        .send({ content: 'E2E 테스트 하기' })
        .expect(201);
    });

    it('실패: 빈 컨텐츠를 보내면 ValidationPipe가 400을 반환해야 한다', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/todo')
        .send({ content: '' });

      expect(response.status).toBe(400);
    });
  });

  describe('/api/todo (GET)', () => {
    it('성공: 저장된 할 일 목록을 DTO 형식으로 반환해야 한다', async () => {
      await request(app.getHttpServer())
        .post('/api/todo')
        .send({ content: '목록 확인용' });

      const response = await request(app.getHttpServer())
        .get('/api/todo')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('content');
      expect(response.body[0]).not.toHaveProperty('_id');
    });
  });

  describe('/api/todo/:id/toggle (PATCH)', () => {
    it('실패: 존재하지 않는 ID를 토글하면 ExceptionFilter가 404를 반환해야 한다', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/todo/non-existent-id/toggle')
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('error', 'TodoNotFoundException');
    });
  });
});
