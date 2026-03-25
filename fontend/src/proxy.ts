import { auth } from "@/auth"

// 1. Khai báo danh sách các route không cần bảo vệ (Public Routes)
const publicRoutes = ["/auth/login", "/auth/register", "/verify", "/"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // 2. Nếu đường dẫn người dùng đang vào nằm trong danh sách Public -> Cho qua luôn
    if (publicRoutes.includes(pathname)) {
        // Tùy chọn nâng cao: Nếu đã login rồi mà cố vào lại trang /auth/login -> Đá về Admin
        if (isLoggedIn && pathname.startsWith("/auth/")) {
            return Response.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
        }

        return; // Lệnh return không trả về gì nghĩa là "Cho đi tiếp, không cản nữa"
    }

    // 3. Nếu không phải Public Route (tức là Private), mà chưa login -> Đuổi ra Login
    if (!isLoggedIn) {
        return Response.redirect(new URL("/auth/login", req.nextUrl.origin));
    }
})

// Vẫn giữ config này để né các file tĩnh (CSS, JS, Hình ảnh) giúp web chạy nhanh
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}