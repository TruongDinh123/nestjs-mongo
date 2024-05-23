import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import slugify from 'slugify';
import { User } from 'src/users/user.schema';

export type ProductDocument = Product & Document;
export type ElectronicsDocument = Electronics & Document;
export type ClothingDocument = Clothing & Document;

@Schema({ collection: 'Products', timestamps: true })
export class Product {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  product_name: string;

  @Prop({ required: true })
  product_thumbnail: string;

  @Prop({ required: true })
  product_price: number;

  @Prop({ required: true })
  product_description: string;

  @Prop({ required: true })
  product_quantity: number;

  @Prop()
  product_slug: string;

  @Prop({ required: true, enum: ['Electronics', 'Clothing', 'Food', 'Books'] })
  product_type: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  @Type(() => User)
  product_account: User;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  product_attributes: any;

  @Prop({
    default: 4.5,
    min: 1,
    max: 5,
    set: (val: number) => Math.round(val * 10) / 10,
  })
  product_rattingAverage: number;

  @Prop({ type: Array, default: [] })
  product_variations: any[];

  @Prop({ default: true, index: true, select: true })
  isDraft: boolean;

  @Prop({ default: false, index: true, select: false })
  isPublished: boolean;
}

@Schema({ collection: 'electronics', timestamps: true })
export class Electronics {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;
  @Prop({ required: true })
  manufacturer: string;
  @Prop({ required: true })
  model: string;
  @Prop({ required: true })
  color: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  @Type(() => User)
  product_account: User;
}

@Schema({ collection: 'clothes', timestamps: true })
export class Clothing {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;
  @Prop({ required: true })
  brand: string;
  @Prop({ required: true })
  size: string;
  @Prop({ required: true })
  meterial: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  @Type(() => User)
  product_account: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export const ElectronicSchema = SchemaFactory.createForClass(Electronics);
export const ClothingSchema = SchemaFactory.createForClass(Clothing);

ProductSchema.index({ product_name: 'text', product_description: 'text' });

ProductSchema.pre<Product>('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});
