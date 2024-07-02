import { Types } from 'mongoose';

export default class PublishProductByShopDto {
  product_id: Types.ObjectId;
  product_account?: Types.ObjectId;
}
