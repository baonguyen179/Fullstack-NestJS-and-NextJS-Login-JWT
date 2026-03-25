/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthError } from "@auth/core/errors";

export class CustomAuthError extends AuthError {
    static type: string;

    constructor(message?: any) {
        super();

        this.type = message;
    }
}
export class InvalidEmailPasswordError extends AuthError {
    constructor() {
        super();
        this.type = "Email/Password không hợp lệ!" as any;
    }
}
export class EmailNotVerifiedError extends AuthError {
    constructor() {
        super();
        this.type = "Tài khoản chưa kịch hoạt!" as any;
    }
}