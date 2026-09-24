import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VariantOrmEntity } from '../catalog/variant.orm-entity';
import { MovementType } from './movement-type.enum';
import { MovementMotive } from './movement-motive.enum';

@Entity('stock_movement')
export class StockMovementOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => VariantOrmEntity, {
    nullable: false,
  })
  variant!: VariantOrmEntity;

  @Column({ type: 'simple-enum', enum: MovementType })
  type!: MovementType;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'simple-enum', enum: MovementMotive })
  motive!: MovementMotive;

  @CreateDateColumn()
  createdAt!: Date;
}
