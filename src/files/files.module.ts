import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicFile, PublicFileSchema } from './publicFile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PublicFile.name, schema: PublicFileSchema },
    ]),
    ConfigModule,
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
