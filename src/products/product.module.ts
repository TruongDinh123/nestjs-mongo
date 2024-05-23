import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Clothing,
  ClothingSchema,
  ElectronicSchema,
  Electronics,
  Product,
  ProductSchema,
} from './product.schema';
import ProductsController from './product.controller';
import ProductFactory from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Electronics.name, schema: ElectronicSchema },
      { name: Clothing.name, schema: ClothingSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductFactory],
})
export default class ProductModule {}
