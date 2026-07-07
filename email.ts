//
// Real-world: connect SendGrid, Mailgun, AWS SES, or SMTP.
// Currently logs alerts in `email_alerts` table + console.
//

import { db } from "@/db";
import { emailAlerts, settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomInt } from "crypto";

export async function sendLoginAlertEmail(userId: number, email: string, name: string) {
  const timestamp = new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" });
  const subject = `[Security Alert] Ayaan Mart BD Login - ${timestamp}`;
  const message = `
প্রিয় ${name},

আপনার Ayaan Mart BD অ্যাকাউন্টে এইমাত্র লগইন করা হয়েছে।

⏰ সময়: ${timestamp}
📧 ইমেইল: ${email}
📍 আইপি: (server side only)

যদি এটি আপনি না করে থাকেন, দয়া করে দ্রুত আপনার পাসওয়ার্ড পরিবর্তন করুন এবং আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন:
📞 +8801911602590
📧 info@ayaanmartbd.com

ধন্যবাদ,
Ayaan Mart BD Team
`.trim();

  try {
    const [siteSettingsArr] = await Promise.all([
      db.select().from(settings).where(eq(settings.key, "contact_email")),
    ]);

    const siteEmail = siteSettingsArr[0]?.value || "info@ayaanmartbd.com";

    // Store in email_alerts table (acts as a send log)
    await db.insert(emailAlerts).values({
      user_id: userId,
      email,
      subject,
      message,
    });

    // In production: use nodemailer or Mailgun here
    console.log(`==================================`);
    console.log(`📧 LOGIN ALERT EMAIL`);
    console.log(`   From: ${siteEmail}`);
    console.log(`   To:   ${email}`);
    console.log(`   Subject: ${subject}`);
    console.log(`==================================`);
  } catch (err) {
    console.error("Failed to queue login alert email:", err);
  }
}

export function generateOTP(): string {
  return String(randomInt(100000, 999999));
}

export async function sendOTPEmail(email: string, name: string, otp: string) {
  const subject = `Your Ayaan Mart BD Verification Code: ${otp}`;
  const message = `
প্রিয় ${name},

Ayaan Mart BD-তে রেজিস্ট্রেশন করার জন্য আপনাকে স্বাগতম! 🎉

আপনার ভেরিফিকেশন কোড: ${otp}

⚠️ দ্রষ্টব্য: আপনার অ্যাকাউন্ট ভেরিফাই করতে এই একই কোডটি আপনার মোবাইল নাম্বারে SMS আকারেও পাঠানো হয়েছে। ওয়েবসাইটে ভেরিফিকেশনের সময় এই কোডটি ব্যবহার করুন।

এই কোডটি ১০ মিনিটের জন্য বৈধ থাকবে।

যদি আপনি রেজিস্ট্রেশন না করে থাকেন, দয়া করে এই ইমেইলটি উপেক্ষা করুন।

ধন্যবাদ,
Ayaan Mart BD Team
📞 +8801911602590
📧 info@ayaanmartbd.com
`.trim();

  try {
    await db.insert(emailAlerts).values({
      user_id: 0,
      email,
      subject,
      message,
    });

    console.log(`==================================`);
    console.log(`📧 OTP EMAIL`);
    console.log(`   To:   ${email}`);
    console.log(`   OTP:  ${otp}`);
    console.log(`==================================`);
  } catch (err) {
    console.error("Failed to queue OTP email:", err);
  }
}

export async function sendOTPMobile(phone: string, otp: string) {
  const message = `Your Ayaan Mart BD verification code is: ${otp}. Valid for 10 minutes. Use this code to verify your account.`;

  // In production: connect to a Bangladeshi SMS gateway (e.g., SSL Wireless, Banglalink, or bulk SMS API)
  console.log(`==================================`);
  console.log(`📱 OTP SMS (Primary Verification Channel)`);
  console.log(`   To:   ${phone}`);
  console.log(`   OTP:  ${otp}`);
  console.log(`   Msg:  ${message}`);
  console.log(`==================================`);

  return { success: true };
}
