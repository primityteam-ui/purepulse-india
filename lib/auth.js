import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password

        if (!email || !password) {
          return null
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (email === adminEmail && password === adminPassword) {
          return {
            id: 'farmorigin-admin',
            name: 'Farm Origin Store Owner',
            email: adminEmail,
            role: 'admin'
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'admin'
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}
