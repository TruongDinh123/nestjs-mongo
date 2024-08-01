import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './user.schema';
import PostsModule from '../posts/posts.module';
import UsersService from './users.service';
import { FilesModule } from 'src/files/files.module';
import { UsersController } from './user.controller';
import { PrivateFilesModule } from 'src/privateFiles/private.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PostsModule,
    FilesModule,
    PrivateFilesModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
