import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type UserDocument = PublicFile & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class PublicFile {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  url: string;

  @Prop()
  key: string;
}

const PublicFileSchema = SchemaFactory.createForClass(PublicFile);

export { PublicFileSchema };
