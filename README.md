# 🌤️ WeatherApp

**WeatherApp** is a modern weather forecasting web app built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, offering real-time weather insights, forecasts, and location tracking. It features secure Google login, Stripe-based subscription payments, and beautiful location-aware UI powered by Google Maps and OpenWeatherMap.

---

## 🚀 Key Features

- ⚙️ Modular & Scalable Architecture (Next.js 14 + TypeScript)
- 🎨 Modern UI with Tailwind CSS
- 🔐 Google OAuth via NextAuth.js
- ☁️ Real-time weather & forecast using OpenWeatherMap API
- 💳 Subscription billing with Stripe
- 🗺️ Location-aware features with Google Maps API
- 🧩 PostgreSQL + Prisma for type-safe data persistence

---

## 🧰 Tech Stack

| Tech                | Purpose                          |
|---------------------|----------------------------------|
| Next.js 14          | Frontend & Backend Framework     |
| TypeScript          | Static Typing                    |
| Tailwind CSS        | Styling                          |
| PostgreSQL          | Database                         |
| Prisma ORM          | Database Queries                 |
| NextAuth.js         | Google Login                     |
| Stripe API          | Payments & Webhooks              |
| OpenWeatherMap API  | Weather Data                     |
| Google Maps API     | Location & Map                   |

---

## 📦 Installation Guide

### ✅ Prerequisites

- Node.js v18+
- PostgreSQL (local or cloud)
- Stripe CLI (for webhook testing)
- Google Cloud Account (for Maps + OAuth)
- Git

---

### 📁 Clone the Repository

```bash
git clone https://github.com/iqbaliqra/Weatherapp.git
cd Weatherapp
```

### 📦 Install Dependencies

```bash
npm install
# or if there are issues:
npm install --force
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and fill in the following keys:

```env
# PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/weatherapp"

# NextAuth (Google OAuth)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_SECRET="generate-a-secure-secret"
NEXTAUTH_URL="http://localhost:3000"

# OpenWeatherMap API
OPENWEATHERMAP_API_KEY="your-openweathermap-api-key"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Stripe
STRIPE_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🧪 How to Get API Keys

### 🌤️ OpenWeatherMap API

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up and log in.
3. Navigate to your dashboard → API Keys → Create Key.
4. Copy the key and paste in `.env` as `OPENWEATHERMAP_API_KEY`.

---

### 🗺️ Google Maps API Key

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create/select a project.
3. Enable the **Maps JavaScript API**.
4. Go to **Credentials** > **Create API Key**.
5. Add it to `.env` as:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

---

### 🔐 Google OAuth (Google Login)

1. Go to [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials** → **OAuth Client ID**
3. Choose **Web application**
4. Add `http://localhost:3000` to:
   - Authorized JavaScript origins
   - Authorized redirect URIs → `http://localhost:3000/api/auth/callback/google`
5. After creating, copy:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

---

### 💳 Stripe API & Webhook Secret

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to **Developers → API keys**
3. Copy the **Secret key** and use in:

```env
STRIPE_KEY="your-stripe-secret-key"
```

4. Set up webhook for local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

5. Stripe CLI will give you a webhook signing secret like:

```bash
> Ready! Your webhook signing secret is whsec_XXXXXXXXXXXX
```

Add it to `.env` as:

```env
STRIPE_WEBHOOK_SECRET="your-webhook-secret"
```

---

## 🧱 Database Setup

### 1. Install Prisma

```bash
npm install prisma @prisma/client --force
```

### 2. Run Migration

```bash
npx prisma migrate dev --name init
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

---

## 💻 Start Development Server

```bash
npm run dev
```

In a **new terminal**, start the Stripe webhook listener:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Visit the app at: [http://localhost:3000](http://localhost:3000)

---

## ✅ Testing Guide

### Stripe Test Card

Use this for checkout:

- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)

### Google Login

Use the test user from your Google Cloud project OAuth screen.

---

## 🚀 Deployment

### ✅ Vercel (Recommended)

1. Push code to GitHub.
2. Go to [https://vercel.com](https://vercel.com)
3. Import your GitHub repo.
4. Add all environment variables in Vercel settings.
   ## 🚀 Vercel Deployment Notes

After deploying your app to Vercel, make sure to update the following for production use:

### 🔐 Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Edit your existing OAuth Client ID.
3. Update the **Authorized redirect URI**:

https://your-vercel-app.vercel.app/api/auth/callback/google


4. Update the **Authorized JavaScript origin**:

https://your-vercel-app.vercel.app


5. Wait for a few minutes (sometimes up to an hour) for the changes to propagate.
6. Add the same Google credentials to your Vercel environment variables.

---

### 💳 Stripe Webhook Setup on Vercel

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks).
2. Click **Add endpoint**.
3. Set the endpoint URL to:

https://your-vercel-app.vercel.app/api/stripe/webhook


4. Select the events you want to listen to (e.g.):
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`

5. Save the endpoint.
6. Stripe will generate a **webhook secret** — copy it.
7. Add it to your Vercel environment variables as:

STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXX


8. Wait a few minutes (Stripe may take time to start sending events).
9. Redeploy the app if needed.

---

---

## 🧾 Production Build (Other Platforms)

- Ensure all env variables are set.
- Use a production PostgreSQL DB.
- Run:

```bash
npm run build
```

---

## 🛠 Support

For help, feature requests or bug reports, open an issue:

🔗 [https://github.com/iqbaliqra/Weatherapp/issues](https://github.com/iqbaliqra/Weatherapp/issues)

---

## 📄 License

This project is open source and available under the **MIT License**.

---
