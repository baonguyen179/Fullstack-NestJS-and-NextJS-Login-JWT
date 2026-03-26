import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { EmailNotVerifiedError, InvalidEmailPasswordError } from "@/utils/errors"
import { sendRequest } from "@/utils/api"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {

                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: 'POST',
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
                    body: {
                        email: credentials.email,
                        password: credentials.password
                    }
                })
                // console.log("check res: ", res);

                if (res.statusCode === 201 || res.statusCode === 200) {

                    return {
                        id: res.data?.user?._id,
                        email: res.data?.user?.email,
                        _id: res.data?.user?._id,
                        name: res.data?.user?.name,
                        isActive: res.data?.user?.isActive,
                        access_token: res.data?.access_token
                    }
                }
                switch (res.statusCode as number) {
                    case 401:
                        throw new InvalidEmailPasswordError();
                    case 400:
                        throw new EmailNotVerifiedError();
                    default:
                        throw new Error("internal server error")
                }
            },
        })
    ],
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jwt({ token, user }: { token: any, user: any }) {

            if (user) { // user này lấy từ kết quả của authorize trên
                token.user = user as IUser;
                console.log("token after: ", token);

            }
            return token;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session({ session, token }: { session: any, token: any }) {
            (session.user as IUser) = token.user;
            return session;
        },

    },
    pages: {
        signIn: "/auth/login",
    },
})