import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép Frontend gọi API
  app.enableCors();
  // Đặt tiền tố API (ví dụ: localhost:8080/api)
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((err) => {
  console.error('Lỗi khi khởi động ứng dụng:', err);
});
