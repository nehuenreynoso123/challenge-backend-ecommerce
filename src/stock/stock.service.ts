import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VariantOrmEntity } from '../catalog/variant.orm-entity';
import { MovementType } from './movement-type.enum';
import { RegisterMovementDto } from './register-movement.dto';
import { RegisteredMovement } from './registered-movement.interface';
import { StockMovementOrmEntity } from './stock-movement.orm-entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockMovementOrmEntity)
    private readonly movementRepository: Repository<StockMovementOrmEntity>,
    @InjectRepository(VariantOrmEntity)
    private readonly variantRepository: Repository<VariantOrmEntity>,
  ) {}

  async getAvailable(variantId: number): Promise<number> {
    const { available } = (await this.movementRepository
      .createQueryBuilder('m')
      .select(
        'SUM(CASE WHEN m.type = :in THEN m.quantity ELSE 0 END) - SUM(CASE WHEN m.type = :out THEN m.quantity ELSE 0 END)',
        'available',
      )
      .where('m.variantId = :variantId', { variantId })
      .setParameters({ in: MovementType.IN, out: MovementType.OUT })
      .getRawOne()) ?? { available: null };

    return Number(available ?? 0);
  }

  async register(dto: RegisterMovementDto): Promise<RegisteredMovement> {
    const variant = await this.variantRepository.findOne({ where: { sku: dto.sku } });
    if (!variant) {
      throw new NotFoundException(`Variant with sku ${dto.sku} not found`);
    }

    const available = await this.getAvailable(variant.id);
    if (dto.type === MovementType.OUT && available < dto.quantity) {
      throw new ConflictException('Stock movement would leave negative stock');
    }

    const movement = this.movementRepository.create({
      variant,
      type: dto.type,
      quantity: dto.quantity,
      motive: dto.motive,
    });
    const saved = await this.movementRepository.save(movement);

    return {
      id: saved.id,
      sku: variant.sku,
      type: saved.type,
      quantity: saved.quantity,
      motive: saved.motive,
      createdAt: saved.createdAt,
      available: await this.getAvailable(variant.id),
    };
  }
}
