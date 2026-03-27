import { IsEmail, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsOptional()
  name: string;
}

export class CheckCodeDto {
  @IsMongoId()
  @IsNotEmpty({ message: '_id không phù hợp' })
  _id: string;
  @IsNotEmpty()
  codeId: string;
}
export class RetryActiveDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class RetryPasswordDto {
  @IsNotEmpty()
  codeId: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  confirm: string;
}
