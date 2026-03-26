import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { hashPassword } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CheckCodeDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}
  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email is exist: ${email}. Vui lòng dùng email khác.`,
      );
    }
    const hashPass = await hashPassword(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPass,
      phone,
      address,
      image,
    });
    return {
      _id: user._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    delete filter.current;
    delete filter.pageSize;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * +pageSize;
    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .sort(sort as any);
    return { totalPages, totalItems, results };
  }

  async findOne(id: string) {
    // 1. Kiểm tra định dạng ID
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id không đúng định dạng mongoose.');
    }

    // 2. Tìm kiếm User
    const user = await this.userModel.findById(id).select('-password');

    // 3. Kiểm tra nếu không tìm thấy User trong DB
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với id: ${id}`);
    }

    return user;
  }
  findByEmail(email: string) {
    const user = this.userModel.findOne({ email });
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id))
      return await this.userModel.deleteOne({ _id: id });
    else throw new BadRequestException('Id không đúng định dạng mongoose.');
  }
  async handleRegister(createUserDto: CreateAuthDto) {
    const { name, email, password } = createUserDto;
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email is exist: ${email}. Vui lòng dùng email khác.`,
      );
    }
    const hashPass = await hashPassword(password);
    const expiredAt = dayjs().add(1, 'day').toDate();

    const { v4: uuidv4 } = await import('uuid');
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPass,
      codeId: codeId,
      codeExpired: expiredAt,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mailerService.sendMail({
      to: 'baohp17@gmail.com',
      subject: 'Xác nhận đăng ký tài khoản mới',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        otp: codeId,
      },
    });
    return {
      _id: user._id,
    };
  }
  async handleCheckCode(checkcodeDto: CheckCodeDto) {
    const user = await this.userModel.findOne({
      _id: checkcodeDto._id,
      codeId: checkcodeDto.codeId,
    });
    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn!');
    }
    const isBeforeCheck = dayjs().isBefore(dayjs(user.codeExpired));
    if (isBeforeCheck) {
      await this.userModel.updateOne(
        { _id: checkcodeDto._id },
        {
          isActive: true,
          codeId: null, // Tiêu hủy mã code để chống dùng lại
          codeExpired: null,
        },
      );
      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn!');
    }
  }
}
