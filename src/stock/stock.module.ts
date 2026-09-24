import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementOrmEntity } from './stock-movement.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovementOrmEntity])],
})
export class StockModule {}
