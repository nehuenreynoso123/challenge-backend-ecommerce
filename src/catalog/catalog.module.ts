import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogSeedService } from './catalog-seed.service';
import { CategoryOrmEntity } from './category.orm-entity';
import { ProductOrmEntity } from './product.orm-entity';
import { VariantOrmEntity } from './variant.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryOrmEntity, ProductOrmEntity, VariantOrmEntity])],
  providers: [CatalogSeedService],
})
export class CatalogModule {}
