import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity';
import { VariantOrmEntity } from './variant.orm-entity';

@Entity('product')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @ManyToOne(() => CategoryOrmEntity, (category) => category.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  category!: CategoryOrmEntity;

  @OneToMany(() => VariantOrmEntity, (variant) => variant.product)
  variants!: VariantOrmEntity[];
}
