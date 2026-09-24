import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity';
import { ProductOrmEntity } from './product.orm-entity';
import { VariantOrmEntity } from './variant.orm-entity';

@Injectable()
export class CatalogSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly categoryRepository: Repository<CategoryOrmEntity>,
    @InjectRepository(ProductOrmEntity)
    private readonly productRepository: Repository<ProductOrmEntity>,
    @InjectRepository(VariantOrmEntity)
    private readonly variantRepository: Repository<VariantOrmEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if ((await this.categoryRepository.count()) > 0) return;

    const category = this.categoryRepository.create({ name: 'Calzado' });
    const savedCategory = await this.categoryRepository.save(category);

    const product = this.productRepository.create({
      name: 'Zapatilla nike',
      description: 'zapatilla de basquet',
      price: 122.99,
      category: savedCategory,
    });

    await this.productRepository.save(product);

    await this.variantRepository.save(
      this.variantRepository.create({
        sku: 'SKU-001',
        size: '43',
        color: 'blanco',
        product,
      }),
    );
    await this.variantRepository.save(
      this.variantRepository.create({
        sku: 'SKU-002',
        size: '38',
        color: 'negro',
        product,
      }),
    );
  }
}
