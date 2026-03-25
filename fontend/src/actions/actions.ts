'use server'

import { signIn } from '@/auth';
import { AuthError } from "@auth/core/errors";


export async function authenticate(email: string, password: string) {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

    } catch (error) {
        // 1. Nếu là lỗi do NextAuth ném ra (sai pass, chưa active...)
        if (error instanceof AuthError) {

            // Lấy ra cái thông báo lỗi mà bạn đã ném ở hàm authorize
            const customError = error.cause?.err;

            // Kiểm tra xem có phải lỗi chưa verify email không
            if (customError?.name === 'EmailNotVerifiedError') {
                return { error: true, code: 3, message: "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email." };
            }

            // Các lỗi mặc định khác của NextAuth
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: true, message: 'Email hoặc mật khẩu không chính xác.' };
                default:
                    return { error: true, message: 'Đã có lỗi xảy ra từ máy chủ.' };
            }
        }

        return { error: true, message: 'Đã có lỗi hệ thống không xác định xảy ra.' };
    }
}