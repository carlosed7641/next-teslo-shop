import prisma from '@/lib/prisma';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account'
    },
    callbacks: {

        jwt({ token, user }) {
            if (user) {
                token.data = user
            }
            return token
        },
        session({ session, token }) {
            session.user = token.data as any // eslint-disable-line
            return session
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null

                const { email, password } = parsedCredentials.data

                // Buscar el usuario en la base de datos
                const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
                if (!user) return null

                // Verificar la contraseña
                if (!bcryptjs.compareSync(password, user.password)) return null

                // Retornar el usuario
                const { password: _, ...rest } = user
                String(_) // Para evitar el warning de variable no utilizada
                return rest

            }
        }),
    ]
}

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);