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
import RequestWithUser from 'src/authentication/requestWithUser.interface';

@Injectable()
class ProductFactory {
  static productRegistry: Record<string, any> = {}; //chứa key-class

  static registerProductType(type: string, classRef: any): void {
    ProductFactory.productRegistry[type] = classRef;
  }

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Clothing.name) private clothingModel: Model<ClothingDocument>,
    @InjectModel(Electronics.name)
    private electronicsModel: Model<ElectronicsDocument>,
  ) {}

  async createProduct(
    type: string,
    createProductDto: ProductDto,
  ): Promise<ProductDocument | ClothingDocument | ElectronicsDocument> {
    const productClass = ProductFactory.productRegistry[type];
    console.log('🚀 ~ productClass:', productClass);
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
    console.log('🚀 ~ newProduct service:', newProduct);
    return newProduct;
  }
}

//Define sub-class for different product types Clothing
class ClothingService extends ProductService {
  async createProduct(createProductDto: ProductDto): Promise<ClothingDocument> {
    console.log('🚀 ~ createProductDto:', createProductDto);
    console.log('Clothing Model:', this.clothingModel);
    const newClothing = await this.clothingModel.create({
      ...createProductDto.product_attributes,
      product_account: createProductDto.product_account,
    });
    console.log('🚀 ~ newClothing:', newClothing);
    if (!newClothing) {
      throw new BadRequestException('Tạo mới clothing không thành công');
    }

    const productData = {
      ...createProductDto,
      _id: newClothing._id,
      product_account: createProductDto.product_account,
    };
    console.log('🚀 ~ productData:', productData);

    try {
      const newProduct = await super.createProduct(
        productData,
        newClothing._id.toString(),
      );
      console.log('🚀 ~ newProduct:', newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new BadRequestException(
        'Failed to create product due to data validation error.',
      );
    }
    return newClothing;
  }
}

///register new product types
ProductFactory.registerProductType('Clothing', ClothingService);

export default ProductFactory;
