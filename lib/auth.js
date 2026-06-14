import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Email Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase()?.trim()
        const password = credentials?.password

        if (!email || !password) {
          return null
        }

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()?.trim()
        const adminPassword = process.env.ADMIN_PASSWORD

        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
          return {
            id: 'farmorigin-admin',
            name: 'Farm Origin Store Owner',
            email: adminEmail,
            role: 'admin'
          }
        }

        await connectDB()

        const user = await User.findOne({ email }).lean()

        if (!user || !user.password) {
          return null
        }

        const passwordMatches = await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
          return null
        }

        return {
          id: String(user._id),
          name: user.name || 'Customer',
          email: user.email,
          role: user.role || 'customer'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'customer'
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || 'customer'
        session.user.id = token.id
      }

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}
