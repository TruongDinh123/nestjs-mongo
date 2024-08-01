import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Address, AddressSchema } from './address.schema';
import { Post } from '../posts/post.schema';
import { PublicFile } from 'src/files/publicFile.schema';
import { PrivateFile } from 'src/privateFiles/privateFile.schema';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  @Expose()
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  @Expose()
  lastName: string;

  fullName: string;

  @Prop()
  @Exclude() // - dùng để ẩn thông tin password trong response
  password: string;

  @Prop({ type: AddressSchema })
  @Type(() => Address)
  address: Address;

  @Prop({ required: true })
  roles: [string];

  @Prop()
  isBlock: boolean;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;

  @Type(() => Post)
  posts: Post[];

  @Prop({ type: PublicFile, ref: 'PublicFile', nullable: true })
  avatar?: PublicFile;

  @Prop({
    type: PrivateFile,
    ref: 'PrivateFile',
  })
  files: PrivateFile[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ firstName: 'text', lastName: 'text' });

UserSchema.virtual('fullName').get(function (this: User) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});

export { UserSchema };
