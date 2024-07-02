import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClothingDocument,
  Electronics,
  ElectronicsDocument,
  Product,
  Clothing,
  ProductDocument,
} from './product.schema';
import { Model } from 'mongoose';
import ProductDto from './dto/product.dto';
import ProductRepository from 'src/models/repo/product.repo';
import PublishProductByShopDto from './dto/publishProduct.dto';

@Injectable()
class ProductFactory {
  static productRegistry: Record<string, any> = {}; //chứa key-class

  static registerProductType(type: string, classRef: any): void {
    ProductFactory.productRegistry[type] = classRef;
  }

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Clothing.name) private clothingModel: Model<ClothingDocument>,
    @InjectModel(Electronics.name) private electronicsModel: Model<ElectronicsDocument>,
    private productRepository: ProductRepository,
  ) {}

  async createProduct(
    type: string,
    createProductDto: ProductDto,
  ): Promise<ProductDocument | ClothingDocument | ElectronicsDocument> {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestException(
        `Product type ${type} not found in product registry`,
      );
    }
    const serviceInstance = new productClass(
      this.productModel,
      this.clothingModel,
      this.electronicsModel,
    );
    return serviceInstance.createProduct(createProductDto);
  }

  // PUT //
  async publishProductByShop({
    product_id,
    product_account,
  }: PublishProductByShopDto) {
    const shop = await this.productRepository.publishProductByShop({
      product_id,
      product_account,
    });
    return shop;
  }

  //query//
  async findAllDraftsForShop({ product_account, limit = 50, skip = 0 }: any) {
    const query = { product_account, isDraft: true };
    return await this.productRepository.findAllDraftForShop({
      query,
      limit,
      skip,
    });
  }

  async findAllPublishForShop({ prodct_account, limit = 50, skip = 0 }: any) {
    const query = { prodct_account, isPublish: true };
    return await this.productRepository.findAllPublishForShop({
      query,
      limit,
      skip,
    });
  }
}

class ProductService {
  constructor(
    protected productModel: Model<ProductDocument>,
    protected clothingModel: Model<ClothingDocument>,
    protected electronicModel: Model<ElectronicsDocument>,
  ) {}

  async createProduct(
    createProductDto: ProductDto,
    product_id?: string,
  ): Promise<ProductDocument | ClothingDocument | ElectronicsDocument> {
    const newProduct = await this.productModel.create({
      ...createProductDto,
      _id: product_id,
      product_account: createProductDto.product_account,
    });
    return newProduct;
  }
}

//Define sub-class for different product types Clothing
class ClothingService extends ProductService {
  async createProduct(createProductDto: ProductDto) {
    const newClothing = await this.clothingModel.create({
      ...createProductDto.product_attributes,
      product_account: createProductDto.product_account,
    });
    if (!newClothing) {
      throw new BadRequestException('Tạo mới clothing không thành công');
    }

    const productData = {
      ...createProductDto,
      _id: newClothing._id,
      product_account: createProductDto.product_account,
    };

    const newProduct = await super.createProduct(productData, newClothing._id);

    return newProduct;
  }
}

class ElectronicsService extends ProductService {
  async createProduct(createProductDto: ProductDto) {
    const newElectronic = await this.electronicModel.create({
      ...createProductDto.product_attributes,
      product_account: createProductDto.product_account,
    });
    if (!newElectronic) {
      throw new BadRequestException('Tạo mới electronic không thành công');
    }
    const productData = {
      ...createProductDto,
      _id: newElectronic._id,
      product_account: createProductDto.product_account,
    };
    const newProduct = await super.createProduct(
      productData,
      newElectronic._id,
    );

    return newProduct;
  }
}

///register new product types
ProductFactory.registerProductType('Clothing', ClothingService);
ProductFactory.registerProductType('Electronics', ElectronicsService);

export default ProductFactory;
