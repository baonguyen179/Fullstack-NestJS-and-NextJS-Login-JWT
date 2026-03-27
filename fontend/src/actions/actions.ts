/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { auth,signIn } from '@/auth';
import { AuthError } from "@auth/core/errors";
import { revalidateTag } from 'next/cache'
import { sendRequest } from "@/utils/api";

export async function authenticate(email: string, password: string) {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

    } catch (error: any) {


        if (error instanceof AuthError) {
            console.log('check error action.ts: ', error);
            // 1. Kiểm tra chính xác cái chuỗi type mà NextAuth trả về
            if ((error.type as string) === 'Tài khoản chưa kịch hoạt!') {
                return {
                    error: true,
                    code: 3,
                    message: "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email để xác thực."
                };
            }

            // 2. Nếu là lỗi sai email/mật khẩu
            if ((error.type as string) === 'Email/Password không hợp lệ!') {
                return {
                    error: true,
                    message: "Email hoặc mật khẩu không chính xác."
                };
            }

            // 3. Các lỗi linh tinh khác
            return { error: true, message: 'Đã có lỗi xảy ra từ máy chủ.' };
        }

        // Bỏ qua throw error, trả về lỗi chung chung
        return { error: true, message: 'Đã có lỗi hệ thống không xác định xảy ra.' };
    }
}

export const handleCreateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users", "default")
    return res;
}

export const handleUpdateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users", "default")
    return res;
}

export const handleDeleteUserAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-users", "default")
    return res;
}
