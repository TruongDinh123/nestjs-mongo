// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import {
//   ClothingDocument,
//   Electronics,
//   ElectronicsDocument,
//   Product,
//   Clothing,
//   ProductDocument,
// } from './product.schema';
// import { Model } from 'mongoose';
// import ProductDto from './dto/product.dto';
// import ProductRepository from 'src/models/repo/product.repo';

// interface IProductService {
//   createProduct(
//     createProductDto: ProductDto,
//     product_id?: string,
//   ): Promise<ProductDocument | ClothingDocument | ElectronicsDocument>;
// }

// @Injectable()
// abstract class ProductService implements IProductService {
//   constructor(
//     @InjectModel(Product.name) protected productModel: Model<ProductDocument>,
//     @InjectModel(Clothing.name)
//     protected clothingModel: Model<ClothingDocument>,
//     @InjectModel(Electronics.name)
//     protected electronicModel: Model<ElectronicsDocument>,
//     protected productRepository: ProductRepository,
//   ) {}

//   abstract createProduct(
//     createProductDto: ProductDto,
//     product_id?: string,
//   ): Promise<ProductDocument | ClothingDocument | ElectronicsDocument>;
// }

// @Injectable()
// class ClothingService extends ProductService {
//   async createProduct(
//     createProductDto: ProductDto,
//   ): Promise<ProductDocument | ClothingDocument | ElectronicsDocument> {
//     const newClothing = await this.clothingModel.create({
//       ...createProductDto.product_attributes,
//       product_account: createProductDto.product_account,
//     });
//     if (!newClothing) {
//       throw new BadRequestException('Tạo mới clothing không thành công');
//     }

//     const productData = {
//       ...createProductDto,
//       _id: newClothing._id,
//       product_account: createProductDto.product_account,
//     };

//     const newProduct = await super.createProduct(productData, newClothing._id);

//     return newProduct;
//   }
// }

// @Injectable()
// class ElectronicsService extends ProductService {
//   async createProduct(
//     createProductDto: ProductDto,
//   ): Promise<ProductDocument | ClothingDocument | ElectronicsDocument> {
//     const newElectronic = await this.electronicModel.create({
//       ...createProductDto.product_attributes,
//       product_account: createProductDto.product_account,
//     });
//     if (!newElectronic) {
//       throw new BadRequestException('Tạo mới electronic không thành công');
//     }
//     const productData = {
//       ...createProductDto,
//       _id: newElectronic._id,
//       product_account: createProductDto.product_account,
//     };
//     const newProduct = await super.createProduct(
//       productData,
//       newElectronic._id,
//     );

//     return newProduct;
//   }
// }

// @Injectable()
// class ProductFactory {
//   static productRegistry: Record<string, any> = {}; // chứa key-class

//   static registerProductType(type: string, classRef: any): void {
//     ProductFactory.productRegistry[type] = classRef;
//   }

//   constructor(
//     @InjectModel(Product.name) private productModel: Model<ProductDocument>,
//     @InjectModel(Clothing.name) private clothingModel: Model<ClothingDocument>,
//     @InjectModel(Electronics.name)
//     private electronicsModel: Model<ElectronicsDocument>,
//     private productRepository: ProductRepository,
//   ) {}

//   async createProduct(
//     type: string,
//     createProductDto: ProductDto,
//   ): Promise<ProductDocument | ClothingDocument | ElectronicsDocument> {
//     const productClass = ProductFactory.productRegistry[type];
//     if (!productClass) {
//       throw new BadRequestException(
//         `Product type ${type} not found in product registry`,
//       );
//     }
//     const serviceInstance = new productClass(
//       this.productModel,
//       this.clothingModel,
//       this.electronicsModel,
//       this.productRepository,
//     );
//     return serviceInstance.createProduct(createProductDto);
//   }
// }

// // Register new product types
// ProductFactory.registerProductType('Clothing', ClothingService);
// ProductFactory.registerProductType('Electronics', ElectronicsService);

// export default ProductFactory;
