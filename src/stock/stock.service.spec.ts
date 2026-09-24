import { ConflictException, NotFoundException } from '@nestjs/common';
import { MovementMotive } from './movement-motive.enum';
import { MovementType } from './movement-type.enum';
import { StockService } from './stock.service';

describe('StockService', () => {
  let service: StockService;

  const movementRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  const variantRepository = {
    findOne: jest.fn(),
  };

  const mockAvailable = (value: string): void => {
    movementRepository.createQueryBuilder.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ available: value }),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new StockService(movementRepository as never, variantRepository as never);
  });

  it('calcula disponible como SUM(in) - SUM(out)', async () => {
    mockAvailable('7');

    const available = await service.getAvailable(1);

    expect(available).toBe(7);
  });

  it('rechaza un OUT que deja stock negativo (409)', async () => {
    variantRepository.findOne.mockResolvedValue({ id: 1, sku: 'SKU-001' });
    mockAvailable('3');

    await expect(
      service.register({
        sku: 'SKU-001',
        type: MovementType.OUT,
        quantity: 10,
        motive: MovementMotive.RETURN,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rechaza un SKU inexistente (404)', async () => {
    variantRepository.findOne.mockResolvedValue(null);

    await expect(
      service.register({
        sku: 'DESCONOCIDO',
        type: MovementType.IN,
        quantity: 1,
        motive: MovementMotive.PURCHASE,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
