import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    // Đặt tên Context là 'HTTP' để dễ phân biệt màu sắc trên Terminal
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';
        const startTime = Date.now(); // Bắt đầu tính giờ

        // Lắng nghe sự kiện khi response đã được trả về cho Client xong
        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length') || 0;
            const duration = Date.now() - startTime; // Tính toán thời gian chạy API

            // Định dạng dòng log in ra
            this.logger.log(
                `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} [${duration}ms]`
            );
        });

        next(); // Bắt buộc phải có để request đi tiếp vào Controller
    }
}