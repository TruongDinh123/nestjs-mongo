import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PrivateFile } from './privateFile.schema';
import { Model } from 'mongoose';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrivateFilesService {
  constructor(
    @InjectModel(PrivateFile.name)
    private privateFilesModel: Model<PrivateFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPrivateFile(
    onwerId: string,
    dataBuffer: Buffer,
    filename: string,
  ) {
    const s3 = new S3();

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME') || '',
        Body: dataBuffer,
        Key: `${uuid()} - ${filename}`,
      })
      .promise();

    const newFile = await this.privateFilesModel.create({
      key: uploadResult.Key,
      owner: {
        _id: onwerId,
      },
    });

    return newFile.toObject();
  }

  async getPrivateFile(filedId: string) {
    const s3 = new S3();

    const fileInfo = await this.privateFilesModel
      .findById(filedId)
      .populate('owner')
      .lean();

    if (fileInfo) {
      const stream = await s3
        .getObject({
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME') || '',
          Key: fileInfo.key,
        })
        .createReadStream();

      return {
        stream,
        info: fileInfo,
      };
    }

    throw new NotFoundException();
  }

  public async generatePresignedUrl(key: string) {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME') || '',
      Key: key,
    });
  }
}
