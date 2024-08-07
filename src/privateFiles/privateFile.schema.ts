import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import * as mongoose from 'mongoose';
import { User } from 'src/users/user.schema';

export type PrivateFileDocument = PrivateFile & Document;

@Schema()
export class PrivateFile {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: User;
}

const PrivateFileSchema = SchemaFactory.createForClass(PrivateFile);

export { PrivateFileSchema };
