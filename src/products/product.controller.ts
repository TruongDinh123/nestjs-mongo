import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { Product } from './product.schema';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import ProductDto from './dto/product.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import ProductFactory from './product.service';

@Controller('products')
@UseInterceptors(MongooseClassSerializerInterceptor(Product))
export default class ProductsController {
  constructor(private readonly productFactory: ProductFactory) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(
    @Body() product: ProductDto,
    @Req() req: RequestWithUser,
  ) {
    const newProduct = await this.productFactory.createProduct(
      product.product_type,
      {
        ...product,
        product_account: req.user._id,
      },
    );
    return newProduct;
  }
}
