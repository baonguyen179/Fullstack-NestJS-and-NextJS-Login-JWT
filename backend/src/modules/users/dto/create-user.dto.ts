// import { Prop } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  image: string;
  // @Prop({ default: 'USER' })
  // role: string;
  // @Prop({ default: 'LOCAL' })
  // accountType: string;
  // @Prop({ default: false })
  // isActive: boolean;

  // @Prop()
  // codeId: string;

  // @Prop()
  // codeExpired: Date;
}
