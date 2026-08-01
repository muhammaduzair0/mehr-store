import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseServer } from "@/lib/supabase-server";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'},
            },
        async authorize(credentials) {
            if(!credentials?.email || !credentials?.password) return null

            // Get user from Supabase
            const { data: user } = await supabaseServer
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single()

            if (!user) return null

            // Check Password
            const valid = await bcrypt.compare(credentials.password, user.password)
            if (!valid) return null

            return {
                id: user.id,
                email: user.email,
                name: `${user.first_name} ${user.last_name}`,
                first_name: user.first_name,
                last_name: user.last_name,
            }
        },
    }),
],
callbacks: {
    async jwt({token, user}) {
        if (user) {
            token.id = user.id
            token.first_name = (user as any).first_name
            token.last_name = (user as any).last_name
        }
        return token
    },
    async session({session, token}) {
        session.user.id = token.id as string
        session.user.first_name = token.first_name as string
        session.user.last_name = token.last_name as string
        return session
    },
},
pages: {
    signIn: '/login',
},
secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST}