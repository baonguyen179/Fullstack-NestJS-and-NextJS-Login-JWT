import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 8080);

  // Cho phép Frontend gọi API
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, //nếu thêm thuộc tính không tồn tại vào thì báo
      transform: true,
    }),
  );
  // Đặt tiền tố API (ví dụ: localhost:8080/api)
  app.setGlobalPrefix('api/v1', { exclude: [''] });

  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('Lỗi khi khởi động ứng dụng:', err);
});
