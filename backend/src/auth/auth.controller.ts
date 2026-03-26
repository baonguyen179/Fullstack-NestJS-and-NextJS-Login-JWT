/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { CheckCodeDto, CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(AuthGuard('local'))
  @ResponseMessage('Fetch login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: any }) {
    return req.user;
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }
  @Post('check-code')
  @Public()
  checkcode(@Body() checkcodeDto: CheckCodeDto) {
    return this.authService.handleCheckCode(checkcodeDto);
  }

  @Get('email')
  @Public()
  testMail() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mailerService.sendMail({
      to: 'baohp17@gmail.com',
      subject: 'Xác nhận đăng ký tài khoản mới',
      template: 'register',
      context: {
        name: 'userName',
        otp: '123456',
      },
    });
    return 'ok';
  }
}
