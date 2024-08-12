import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from './user.schema';
import CreateUserDto from './dto/createUser.dto';
import PostsService from '../posts/posts.service';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { PrivateFilesService } from 'src/privateFiles/privateFile.service';
import * as bcrypt from 'bcrypt';

@Injectable()
class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly postsService: PostsService,
    private readonly fileService: FilesService,
    private readonly privateFilesService: PrivateFilesService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).populate({
      path: 'posts',
      populate: {
        path: 'categories',
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const avatar = await this.fileService.uploadPublicFile(
      imageBuffer,
      filename,
    );

    user.avatar = avatar;

    await user.save();

    return avatar;
  }

  async addPrivateFile(userId: string, imageBuffer: Buffer, filename: string) {
    const newFile = await this.privateFilesService.uploadPrivateFile(
      userId,
      imageBuffer,
      filename,
    );

    await this.userModel.findByIdAndUpdate(userId, {
      $push: { files: newFile },
    });

    return newFile;
  }

  async getPrivateFile(userId: string, filedId: string) {
    const file = await this.privateFilesService.getPrivateFile(filedId);

    if (file.info.owner._id.toString() === userId) {
      console.log('🚀 ~ owner._id', file.info.owner._id.toString());
      return file;
    }
    throw new NotFoundException();
  }

  async getAllPrivateFiles(userId: string) {
    const userWithFiles = await this.userModel.findById(userId);

    if (userWithFiles) {
      if (userWithFiles.files && Array.isArray(userWithFiles.files)) {
        return Promise.all(
          userWithFiles.files.map(async (file) => {
            const url = await this.privateFilesService.generatePresignedUrl(
              file.key,
            );
            return {
              ...file,
              url,
            };
          }),
        );
      }
      throw new NotFoundException('No files found for this user');
    }
    throw new NotFoundException('User with this id does not exist');
  }

  async deleteAvatar(userId: string) {
    const user = await this.userModel.findById(userId);
    const fileId = user?.avatar?._id.toString();

    if (fileId) {
      await this.userModel.updateOne({ _id: userId }, { avatar: undefined });
      await this.fileService.deletePublicFile(fileId);
    }
  }

  async create(userData: CreateUserDto) {
    const createdUser = new this.userModel(userData);
    await createdUser
      .populate({
        path: 'posts',
        populate: {
          path: 'categories',
        },
      })
      .execPopulate();
    return createdUser.save();
  }

  async findOrCreate(user: Partial<User>) {
    try {
      let existingUser = await this.userModel.findOne({ email: user.email });
      if (!existingUser) {
        existingUser = new this.userModel(user);
        existingUser.files = existingUser.files || [];
        await existingUser.save();
      }
      return existingUser;
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }

  async delete(userId: string) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const user = await this.userModel
        .findByIdAndDelete(userId, { useFindAndModify: false })
        .populate('posts')
        .session(session);

      if (!user) {
        throw new NotFoundException();
      }
      const posts = user.posts;

      await this.postsService.deleteMany(
        posts.map((post) => post._id.toString()),
        session,
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken || '',
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
}

export default UsersService;
