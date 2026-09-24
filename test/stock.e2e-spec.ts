import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { CatalogModule } from '../src/catalog/catalog.module';
import { StockModule } from '../src/stock/stock.module';

describe('Stock Movimientos (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        }),
        CatalogModule,
        StockModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /stock/movements (in) responde 201 con available', async () => {
    const response = await request(app.getHttpServer()).post('/stock/movements').send({
      sku: 'SKU-001',
      type: 'in',
      quantity: 10,
      motive: 'compra',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      sku: 'SKU-001',
      type: 'in',
      quantity: 10,
      motive: 'compra',
      available: 10,
    });
  });

  it('POST OUT que deja stock negativo responde 409', async () => {
    const response = await request(app.getHttpServer()).post('/stock/movements').send({
      sku: 'SKU-002',
      type: 'out',
      quantity: 99,
      motive: 'devolucion',
    });

    expect(response.status).toBe(409);
  });

  it('POST con SKU inexistente responde 404', async () => {
    const response = await request(app.getHttpServer()).post('/stock/movements').send({
      sku: 'NO-EXISTE',
      type: 'in',
      quantity: 1,
      motive: 'ajuste',
    });

    expect(response.status).toBe(404);
  });

  it('POST con quantity negativa responde 400', async () => {
    const response = await request(app.getHttpServer()).post('/stock/movements').send({
      sku: 'SKU-001',
      type: 'in',
      quantity: -5,
      motive: 'compra',
    });

    expect(response.status).toBe(400);
  });
});
