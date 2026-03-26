/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { checkPassword } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/users/schemas/user.schema';
import { CheckCodeDto, CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await checkPassword(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác',
      );
    }
    return user;
  }
  login(user: any) {
    const activeStatus = String(user.isActive).toLowerCase() === 'true';
    if (activeStatus === false) {
      throw new BadRequestException('Tài khoản chưa được kích hoạt');
    }
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
        isActive: user.isActive,
      },
    };
  }
  handleRegister = async (register: CreateAuthDto) => {
    return await this.usersService.handleRegister(register);
  };
  handleCheckCode = async (checkcodeDto: CheckCodeDto) => {
    return await this.usersService.handleCheckCode(checkcodeDto);
  };
}
