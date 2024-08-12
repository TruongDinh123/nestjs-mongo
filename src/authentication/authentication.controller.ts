import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { User } from '../users/user.schema';
import MongooseClassSerializerInterceptor from '../utils/mongooseClassSerializer.interceptor';
import UsersService from 'src/users/users.service';
import JwtRefreshGuard from './jwt-refresh.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;

    if (!user) {
      throw new UnauthorizedException();
    }

    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);

    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res?.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return {
      id: user.id,
      username: user.email,
      accessTokenCookie: accessTokenCookie,
      refreshTokenCookie: refreshTokenCookie,
    };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    request.res?.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() req: Request) {
    // Guard sẽ xử lý yêu cầu này
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  async googleAuthRedirect(@Req() req: RequestWithUser) {
    const { user } = req;
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    req.res?.setHeader('Set-Cookie', accessTokenCookie);
    return { id: user.id, email: user.email };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request.res?.setHeader('Set-Cookie', accessTokenCookie);
    return { id: request.user.id, email: request.user.email };
  }
}
