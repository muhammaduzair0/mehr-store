import NextAuth from "next-auth";

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            email: string
            name: string
            first_name: string
            last_name: string
        }
    }

    interface User {
        id: string
        first_name: string
        last_name: string
    }
        }

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        first_name: string
        last_name: string
    }
}