import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsMongoId()
  @IsNotEmpty({ message: '_id không phù hợp' })
  _id: string;

  @IsOptional() // Hoặc @IsNotEmpty() nếu bắt buộc
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  image: string;
}
