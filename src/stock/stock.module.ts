import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './stock.controller';
import { StockMovementOrmEntity } from './stock-movement.orm-entity';
import { StockService } from './stock.service';
import { VariantOrmEntity } from '../catalog/variant.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovementOrmEntity, VariantOrmEntity])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
