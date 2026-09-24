import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('category')
export class CategoryOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => ProductOrmEntity, (product) => product.category)
  products!: ProductOrmEntity[];
}
