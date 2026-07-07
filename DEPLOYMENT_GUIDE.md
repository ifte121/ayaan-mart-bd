# 🚀 Ayaan Mart BD — ফ্রি অনলাইনে Publish ও Checking গাইড

এই গাইডটি তোমার **লাইভ Next.js + PostgreSQL** ভার্সনের জন্য (Option B)। সম্পূর্ণ **ফ্রি**তে Frontend ও Backend (Admin Panel `/cpanel`) দুইটাই অনলাইনে চেক করতে পারবে।

---

## 🎯 তুমি যা পাবে শেষে:

| অংশ | URL | কাজ |
|------|-----|-----|
| **Frontend (Customer Site)** | `https://yourdomain.com/` | প্রোডাক্ট ব্রাউজ, কার্ট, চেকআউট |
| **Backend (Admin Panel)** | `https://yourdomain.com/cpanel` | প্রোডাক্ট/অর্ডার/কাস্টমার ম্যানেজমেন্ট |
| **Admin Login** | `https://yourdomain.com/cpanel/login` | সরাসরি এডমিন লগইন পেজ |

> ✅ **Security ইতিমধ্যে সেট করা আছে:** `/cpanel` ও তার সব ভেতরের পেজ + `/api/admin/*` সব রুট **শুধুমাত্র Admin অ্যাকাউন্ট** দিয়েই এক্সেস করা যাবে। সাধারণ Customer বা Login ছাড়া কেউ ঢুকলে অটো `/cpanel/login`-এ রিডাইরেক্ট হয়ে যাবে।

---

## 📦 ধাপ ১: GitHub এ কোড আপলোড করা

### ১.১ GitHub একাউন্ট তৈরি (না থাকলে)
[github.com](https://github.com) এ যাও → **Sign Up** (সম্পূর্ণ ফ্রি)

### ১.২ নতুন Repository তৈরি
1. Dashboard-এ **"New repository"** ক্লিক করো
2. Repository name: `ayaan-mart-bd`
3. **Private** সিলেক্ট করো
4. **Create repository** ক্লিক করো

### ১.৩ কোড Push করা
তোমার কম্পিউটারে ZIP ফাইলটি extract করে সেই ফোল্ডারে গিয়ে টার্মিনাল/CMD খুলো:

```bash
cd ayaan-mart-bd
git init
git add .
git commit -m "Initial commit - Ayaan Mart BD"
git branch -M main
git remote add origin https://github.com/তোমার-ইউজারনেম/ayaan-mart-bd.git
git push -u origin main
```

> ⚠️ **`.env` ফাইল push হবে না** (এটা `.gitignore` তে আছে) — এটাই নিরাপদ, কারণ পাসওয়ার্ড GitHub এ থাকা ঠিক না।

---

## 🗄️ ধাপ ২: ফ্রি PostgreSQL ডাটাবেজ তৈরি (Neon.tech)

1. [neon.tech](https://neon.tech) এ যাও → **Sign Up with GitHub** (সবচেয়ে সহজ, ফ্রি, ৫১২MB)
2. **Create a Project**:
   - Project name: `ayaan-mart-bd`
   - Region: **Singapore (ap-southeast-1)** — বাংলাদেশের কাছে, দ্রুত হবে
3. Project তৈরি হলে **Connection String** কপি করো — এরকম দেখতে হবে:
   ```
   postgresql://username:password@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. এটা একটা নোটপ্যাডে সেভ করে রাখো — পরের ধাপে লাগবে

---

## 🌐 ধাপ ৩: Vercel এ Deploy করা (Frontend + Backend একসাথে)

Next.js অ্যাপে Frontend ও Backend (Admin Panel সহ সব API) **একই কোডবেসে** থাকে, তাই একবার deploy করলেই দুইটাই লাইভ হয়ে যাবে।

1. [vercel.com](https://vercel.com) এ যাও → **Sign Up with GitHub** (ফ্রি, ক্রেডিট কার্ড লাগবে না)
2. Dashboard এ **"Add New..." → "Project"** ক্লিক করো
3. তোমার `ayaan-mart-bd` রিপোজিটরি খুঁজে **Import** করো
4. **Environment Variables** সেকশনে এই তিনটা যোগ করো:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Neon থেকে কপি করা Connection String (ধাপ ২.৩ থেকে) |
   | `JWT_SECRET` | যেকোনো লম্বা random string, যেমন: `ayaanmart2025SecretKeyXyzAbc123` |
   | `NODE_ENV` | `production` |

5. **Deploy** ক্লিক করো — ২-৩ মিনিট অপেক্ষা করো
6. Deploy শেষ হলে একটা লিংক পাবে (উদাহরণ): `https://ayaan-mart-bd.vercel.app`

---

## 🔧 ধাপ ৪: Production Database এ Table ও Sample Data বসানো

তোমার লোকাল কম্পিউটারে (যেখানে কোড extract করেছো):

```bash
# .env ফাইল এডিট করে Neon এর DATABASE_URL বসাও
# .env ফাইলের ভেতরে লিখবে:
DATABASE_URL=postgresql://username:password@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# প্যাকেজ ইনস্টল করো (যদি না থাকে)
npm install

# টেবিল তৈরি করো Neon (production) ডাটাবেজে
npx drizzle-kit push

# Admin, স্যাম্পল প্রোডাক্ট, ক্যাটাগরি ইত্যাদি বসাও
DATABASE_URL="তোমার_Neon_URL" npx tsx src/db/seed.ts
```

✅ `✅ Database seeded successfully!` মেসেজ দেখলেই বুঝবে তোমার প্রোডাকশন ডাটাবেজ রেডি।

---

## 🌍 ধাপ ৫: নিজের ডোমেইন যুক্ত করা (`ayaanmart.darmist.com`)

যদি তোমার `darmist.com` ডোমেইনের DNS Access থাকে (Cloudflare/cPanel DNS ইত্যাদি):

### ৫.১ Vercel এ ডোমেইন যোগ করো
1. Vercel Project → **Settings → Domains**
2. `ayaanmart.darmist.com` টাইপ করে **Add** করো
3. Vercel তোমাকে একটা **CNAME record** দেখাবে, যেমন:
   ```
   Type: CNAME
   Name: ayaanmart
   Value: cname.vercel-dns.com
   ```

### ৫.২ DNS-এ Record বসাও
তোমার ডোমেইন প্রোভাইডারের (যেখান থেকে `darmist.com` কেনা/ম্যানেজ করছো) DNS Settings এ গিয়ে:
- Type: **CNAME**
- Name/Host: **ayaanmart**
- Value/Target: **cname.vercel-dns.com**
- TTL: Auto/Default

### ৫.৩ যাচাই করা
৫-৩০ মিনিট পর (DNS propagate হতে সময় লাগে) Vercel Dashboard এ ডোমেইনের পাশে সবুজ ✅ টিক দেখাবে।

> 💡 **ডোমেইন ছাড়াও কাজ চলবে:** DNS সেটআপ না করেও Vercel-এর দেওয়া ফ্রি `.vercel.app` লিংক দিয়েই সব কিছু ১০০% কাজ করবে — টেস্টিং/চেকিং এর জন্য এটাই যথেষ্ট।

---

## ✅ ধাপ ৬: Frontend চেক করা

তোমার লিংকে যাও (Vercel লিংক অথবা কাস্টম ডোমেইন):

```
https://ayaanmart.darmist.com/
```
বা
```
https://ayaan-mart-bd.vercel.app/
```

চেক করো:
- [ ] হোমপেজ লোড হচ্ছে (ব্যানার, প্রোডাক্ট, ক্যাটাগরি দেখা যাচ্ছে)
- [ ] `/shop` — সব প্রোডাক্ট দেখা যাচ্ছে
- [ ] প্রোডাক্টে ক্লিক করলে ডিটেইলস পেজ খুলছে
- [ ] "কার্টে যোগ করুন" কাজ করছে
- [ ] `/cart` — কার্ট পেজ ঠিকমতো দেখাচ্ছে
- [ ] `/register` — নতুন কাস্টমার রেজিস্ট্রেশন + OTP verify কাজ করছে
- [ ] `/login` — লগইন কাজ করছে
- [ ] `/checkout` — অর্ডার প্লেস করা যাচ্ছে

---

## 🔐 ধাপ ৭: Backend/Admin Panel চেক করা

```
https://ayaanmart.darmist.com/cpanel
```

এই URL এ সরাসরি গেলে **স্বয়ংক্রিয়ভাবে** `/cpanel/login` এ redirect হয়ে যাবে (কারণ তুমি এখনো লগইন করনি) — এটাই সঠিক আচরণ।

### Admin Login করো:
| Field | Value |
|-------|-------|
| Email | `admin@ayaanmartbd.com` |
| Password | `admin123` |

### চেক করো:
- [ ] Login করার পর Dashboard দেখা যাচ্ছে (Stats, Recent Orders)
- [ ] `/cpanel/products` — প্রোডাক্ট লিস্ট, Activate/Deactivate/Delete কাজ করছে
- [ ] `/cpanel/orders` — অর্ডার লিস্ট এবং স্ট্যাটাস পরিবর্তন কাজ করছে
- [ ] `/cpanel/categories` — ক্যাটাগরি যোগ/ডিলিট কাজ করছে
- [ ] `/cpanel/customers` — কাস্টমার লিস্ট, Block/Unblock কাজ করছে
- [ ] `/cpanel/coupons` — কুপন তৈরি কাজ করছে
- [ ] `/cpanel/banners` — ব্যানার যোগ কাজ করছে
- [ ] `/cpanel/settings` — Site Settings সেভ করলে Frontend এ রিফ্লেক্ট হচ্ছে

### 🔒 Security Test (গুরুত্বপূর্ণ):
1. Admin থেকে Logout করো
2. আবার Customer একাউন্ট দিয়ে লগইন করো (`demo@ayaanmartbd.com` / `demo123`)
3. ম্যানুয়ালি ব্রাউজারে `/cpanel` টাইপ করে যাও
4. **এটা তোমাকে অবশ্যই `/cpanel/login` এ রিডাইরেক্ট করে দিবে** — কারণ Customer অ্যাকাউন্টের admin অ্যাক্সেস নেই

---

## 🔄 ধাপ ৮: ভবিষ্যতে কোড Update করা

ভবিষ্যতে কোনো ফাইল পরিবর্তন করতে চাইলে:

```bash
# ফাইল এডিট করো, তারপর:
git add .
git commit -m "যা পরিবর্তন করেছো তার বর্ণনা"
git push origin main
```

➡️ **Vercel স্বয়ংক্রিয়ভাবে নতুন Deploy শুরু করবে** (২-৩ মিনিটে লাইভ) — কোনো ম্যানুয়াল আপলোড লাগবে না।

---

## 🗃️ Database সরাসরি চেক/এডিট করা

Neon Dashboard এ:
1. তোমার প্রজেক্ট ওপেন করো
2. **Tables** ট্যাব — সরাসরি ডাটা ব্রাউজ করা যাবে
3. **SQL Editor** — যেকোনো কুয়েরি রান করা যাবে

অথবা টার্মিনাল থেকে:
```bash
psql "তোমার_Neon_DATABASE_URL"
```

---

## ⚠️ সাধারণ সমস্যা ও সমাধান

| সমস্যা | সমাধান |
|--------|--------|
| Deploy Fail হচ্ছে | Vercel Dashboard → Deployments → Logs দেখো, সাধারণত `DATABASE_URL` ভুল থাকলে হয় |
| `/cpanel` এ গেলে 404 | মনে রাখো: **capital letter ছাড়া** ছোট হাতের `/cpanel` লিখতে হবে |
| Admin Login কাজ করছে না | `npx tsx src/db/seed.ts` ঠিকমতো রান হয়েছে কিনা চেক করো (Neon DB তে Admin ইউজার আছে কিনা) |
| Homepage এ প্রোডাক্ট দেখাচ্ছে না | Seed script রান করা হয়নি, ধাপ ৪ আবার করো |
| ডোমেইন কাজ করছে না | DNS propagate হতে ৩০ মিনিট পর্যন্ত সময় লাগতে পারে, অপেক্ষা করো |

---

## 📋 সংক্ষেপে সময়সূচী

| ধাপ | কাজ | সময় |
|-----|-----|------|
| ১ | GitHub এ push | ৫ মিনিট |
| ২ | Neon ফ্রি DB তৈরি | ৩ মিনিট |
| ৩ | Vercel deploy | ৫ মিনিট |
| ৪ | Schema push + seed | ২ মিনিট |
| ৫ | ডোমেইন যুক্ত (optional) | ৫-৩০ মিনিট |
| ৬-৭ | Frontend + Backend টেস্ট | ১০ মিনিট |

**মোট সময়: ~২৫-৩০ মিনিটেই সম্পূর্ণ লাইভ এবং টেস্টেড! সম্পূর্ণ ফ্রি — কোনো ক্রেডিট কার্ড লাগবে না।**

---

**Ayaan Mart BD — আপনার বিশ্বস্ত অনলাইন শপিং পার্টনার! 🇧🇩**
