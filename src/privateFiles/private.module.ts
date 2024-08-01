import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivateFile, PrivateFileSchema } from './privateFile.schema';
import { ConfigModule } from '@nestjs/config';
import { PrivateFilesService } from './privateFile.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrivateFile.name, schema: PrivateFileSchema },
    ]),
    ConfigModule,
  ],
  providers: [PrivateFilesService],
  exports: [PrivateFilesService],
})
export class PrivateFilesModule {}
