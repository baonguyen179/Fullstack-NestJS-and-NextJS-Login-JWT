'use server'

import { signIn } from '@/auth';
import { AuthError } from "@auth/core/errors";

export async function authenticate(email: string, password: string, callbackUrl: string) {
    try {
        const data = await signIn("credentials", {
            email,
            password,
            // callbackUrl:callbackUrl,
            redirect: false
        });
        console.log("check data: ", data);

    } catch (error) {
        if (error instanceof AuthError) {
            // Kiểm tra cái 'type' chúng ta đã định nghĩa ở errors.ts
            switch (error.type as string) {
                case "InvalidEmailPasswordError":
                    return { success: false, message: "Email hoặc mật khẩu không đúng!", code: 1 };
                case "CredentialsSignin":
                    return { success: false, message: "Đăng nhập thất bại.", code: 2 };
                default:
                    return { success: false, message: "Lỗi hệ thống: " + error.type, code: 3 };
            }
        }
        throw error;
    }
}