import { auth } from "@/auth"

//  các route cố định (Exact Match)
const publicRoutes = ["/auth/login", "/auth/register", "/"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    //  biến kiểm tra tổng hợp
    const isPublicRoute =
        publicRoutes.includes(pathname) || // Khớp chính xác các route cố định
        pathname.startsWith("/verify/");   // Khớp mọi route bắt đầu bằng /verify/ (như /verify/123, /verify/abc)

    if (isPublicRoute) {
        //  Đã login thì không cho vào trang auth nữa
        if (isLoggedIn && pathname.startsWith("/auth/")) {
            return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
        }

        return;
    }

    // 4. Nếu không phải Public Route mà chưa login -> Đuổi ra Login
    if (!isLoggedIn) {
        return Response.redirect(new URL("/auth/login", req.nextUrl.origin));
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}