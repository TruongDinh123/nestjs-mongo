import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/products/product.schema';
import { PaginationParams } from 'src/utils/paginationParams';
@Injectable()
class ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAllDraftForShop({ query, limit, skip }: PaginationParams) {
    return await this.queryProduct({ query, limit, skip });
  }

  async findAllPublishForShop({ query, limit, skip }: PaginationParams) {
    return await this.queryProduct({ query, limit, skip });
  }

  async queryProduct({ query, limit, skip }: PaginationParams) {
    const findAll = await this.productModel
      .find(query)
      .sort({ updateAt: -1 }) //lấy thằng mới nhất
      .skip(skip)
      .limit(limit)
      .populate('product_account', 'name email -_id')
      .lean()
      .exec(); //để nhận biết sử dụng async await trong mongoose

    return findAll;
  }

  async publishProductByShop({ product_id, product_account }: any) {
    const query = {
      _id: product_id,
      product_account: product_account,
    };
    const foundshop = await this.productModel.findOne(query);
    if (!foundshop) return null;

    foundshop.isDraft = false;
    foundshop.isPublished = true;
    const { modifiedCount } = await foundshop.update(foundshop); // sẽ trả về 0 hoặc 1 nếu update thành công hoặc không, hỗ trơ bởi mongoose
    return modifiedCount;
  }
}

export default ProductRepository;
