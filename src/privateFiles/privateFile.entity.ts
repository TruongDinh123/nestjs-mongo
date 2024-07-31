import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type PublicFileDocument = PrivateFile & Document;

@Schema()
export class PrivateFile {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  key: string;

  @Prop()
  owner: {
    type: ObjectId;
    ref: 'User';
    required: true;
  };
}

const PrivateFileSchema = SchemaFactory.createForClass(PrivateFile);

export { PrivateFileSchema };
