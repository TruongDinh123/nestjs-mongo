import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ObjectId, isValidObjectId } from 'mongoose';

export class ProductDto {
  _id: ObjectId;

  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  product_thumbnail: string;

  @IsNumber()
  @IsNotEmpty()
  product_price: number;

  @IsString()
  @IsNotEmpty()
  product_description: string;

  @IsNumber()
  @IsNotEmpty()
  product_quantity: number;

  @IsString()
  @IsNotEmpty()
  product_type: string;

  product_account?: string;

  @IsNotEmpty()
  product_attributes: any; // Thay đổi kiểu dữ liệu phù hợp
}

export default ProductDto;
