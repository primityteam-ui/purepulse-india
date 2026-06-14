# Farm Origin

Complete Next.js 14 full-stack e-commerce starter for selling Indian organic pulses and lentils globally.

## What is included

- Next.js 14 App Router frontend
- MongoDB Atlas with Mongoose models
- Product, order, negotiation, settings, contact, and bulk inquiry APIs
- NextAuth credentials admin login
- Stripe PaymentIntent API
- Razorpay order and signature verification API
- Nodemailer Gmail SMTP email endpoint
- Cloudinary config
- Cart and currency React context
- Seed script for 14 products
- Vercel deployment config

## Local setup order

1. Install Node.js 20 LTS or newer.
2. Open terminal inside this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Create MongoDB Atlas M0 cluster, database user, whitelist `0.0.0.0/0`, and paste your real `MONGODB_URI`.
6. Add a long random `NEXTAUTH_SECRET` and keep `NEXTAUTH_URL=http://localhost:3000` for local testing.
7. Add Stripe test keys and webhook secret.
8. Add Razorpay test keys.
9. Add Gmail app password.
10. Add Cloudinary keys.
11. Run `npm run seed` once to insert the 14 products.
12. Run `npm run dev`.
13. Open `http://localhost:3000`.
14. Admin login is at `/admin/login` using the email/password in `.env.local`.

## Vercel deployment

1. Push this folder to GitHub.
2. Go to Vercel > New Project > Import GitHub repository.
3. Add every variable from `.env.local` in Vercel Project Settings > Environment Variables.
4. Set `NEXTAUTH_URL` to your Vercel live URL.
5. Deploy.
6. In Stripe dashboard, create webhook endpoint: `https://your-domain.vercel.app/api/payments/stripe/webhook`.
7. Select `payment_intent.succeeded` event.
8. Replace `STRIPE_WEBHOOK_SECRET` in Vercel with the live webhook secret.
9. Redeploy.

## Test payments

Use Stripe test card `4242 4242 4242 4242`, any future expiry date, any CVC, and any ZIP.

## Important production notes

`.env.local` contains sample values only. Replace all keys before using payments, email, database, or Cloudinary. Do not commit real secrets to GitHub.

This build is a strong working foundation. You can next improve the admin product editor UI, connect Stripe Elements/Razorpay browser SDK on checkout, and add real shipping carrier integrations.
