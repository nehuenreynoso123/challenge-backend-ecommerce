import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('variant')
export class VariantOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  sku!: string;

  @Column({ nullable: true })
  size?: string;

  @Column({ nullable: true })
  color?: string;

  @ManyToOne(() => ProductOrmEntity, (product) => product.variants, {
    nullable: false,
  })
  product!: ProductOrmEntity;
}
