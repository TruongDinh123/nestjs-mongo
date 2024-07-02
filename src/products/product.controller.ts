import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
import { PaginationParams } from 'src/utils/paginationParams';
import ParamsWithId from 'src/utils/paramsWithId';
import { Types } from 'mongoose';

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

  @Post(':id')
  @UseGuards(JwtAuthenticationGuard)
  async publishProductByShop(
    @Param() { id }: ParamsWithId,
    @Req() req: RequestWithUser,
  ) {
    const productId = new Types.ObjectId(id); // Chuyển đổi id thành ObjectId
    const productAccountId = new Types.ObjectId(req.user._id); // Chuyển đổi user._id thành ObjectId
    return this.productFactory.publishProductByShop({
      product_id: productId,
      product_account: productAccountId,
    });
  }

  //query
  @Get('/drafts/all')
  @UseGuards(JwtAuthenticationGuard)
  async findAllProduct(
    @Query() { skip, limit }: PaginationParams,
    @Req() req: RequestWithUser,
  ) {
    return this.productFactory.findAllDraftsForShop({
      skip,
      limit,
      req,
    });
  }

  @Get('/publish/all')
  @UseGuards(JwtAuthenticationGuard)
  async findAllPublish(
    @Query() { skip, limit }: PaginationParams,
    @Req() req: RequestWithUser,
  ) {
    return this.productFactory.findAllPublishForShop({
      skip,
      limit,
      req,
    });
  }
}
