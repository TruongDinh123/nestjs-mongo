import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PublicFile } from './publicFile.schema';
import { ConfigService } from '@nestjs/config';
import { Model, ObjectId } from 'mongoose';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Types } from 'mongoose';
@Injectable()
export class FilesService {
  constructor(
    @InjectModel(PublicFile.name) private publicFilesModel: Model<PublicFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME') || '',
        Body: dataBuffer,
        Key: `${uuid()} - ${filename}`,
      })
      .promise();

    const newFile = this.publicFilesModel.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });

    return (await newFile).save();
  }

  async deletePublicFile(fileId: string) {
    const file = await this.publicFilesModel.findById(fileId);
    const key = file?.key;

    if (!key) {
      throw new Error('File key is undefined');
    }
    const s3 = new S3();

    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME') || '',
        Key: key,
      })
      .promise();
    await this.publicFilesModel.findByIdAndDelete(fileId);
  }
}
