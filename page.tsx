"use client";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeaderClient from "@/components/HeaderClient";
import FooterClient from "@/components/FooterClient";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const total = getTotal();

  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    area: "",
    deliveryType: "inside_dhaka",
    paymentMethod: "cod",
    transactionId: "",
    notes: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryCharge = form.deliveryType === "inside_dhaka" ? 60 : 120;
  const grandTotal = Math.max(0, total + deliveryCharge - couponDiscount);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.user) {
        setUser(d.user);
        setForm((f) => ({ ...f, name: d.user.name, email: d.user.email, phone: d.user.phone || "" }));
      }
    });
  }, []);

  if (items.length === 0) {
    return (
      <>
        <HeaderClient />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold mb-2">কার্ট খালি!</h2>
            <Link href="/shop" className="btn-primary">শপিং শুরু করুন</Link>
          </div>
        </div>
        <FooterClient />
      </>
    );
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setError("");
    try {
      const res = await fetch("/api/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponCode.trim(), orderTotal: total }) });
      const data = await res.json();
      if (data.success) { setCouponDiscount(data.discount); setCouponApplied(data.code); setCouponCode(""); }
      else setError(data.error || "Invalid coupon");
    } catch { setError("Something went wrong"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone || !form.address) {
      setError("নাম, ফোন নাম্বার ও ঠিকানা আবশ্যক");
      return;
    }
    if (form.paymentMethod !== "cod" && !form.transactionId) {
      setError("ট্রানজেকশন আইডি আবশ্যক");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: form.address,
          city: form.city,
          area: form.area,
          deliveryType: form.deliveryType,
          deliveryCharge,
          paymentMethod: form.paymentMethod,
          transactionId: form.transactionId || null,
          notes: form.notes,
          couponCode: couponApplied,
          couponDiscount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push(`/account?tab=orders&order=${data.order.order_number}`);
      } else {
        setError(data.error || "Order failed");
      }
    } catch { setError("Something went wrong"); }
    setLoading(false);
  };

  return (
    <>
      <HeaderClient />
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
            <i className="fas fa-chevron-right text-xs text-gray-400"></i>
            <Link href="/cart" className="text-gray-500 hover:text-primary">কার্ট</Link>
            <i className="fas fa-chevron-right text-xs text-gray-400"></i>
            <span className="text-gray-800 font-medium">চেকআউট</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4">
              <i className="fas fa-exclamation-circle mr-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Info */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="font-bold text-lg mb-4">শিপিং তথ্য</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">নাম *</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">ইমেইল</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">ফোন নাম্বার *</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="form-input" placeholder="01XXXXXXXXX" />
                    </div>
                    <div>
                      <label className="form-label">শহর</label>
                      <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="form-input" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">ঠিকানা *</label>
                      <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required className="form-input" rows={2} placeholder="বিস্তারিত ঠিকানা লিখুন"></textarea>
                    </div>
                    <div>
                      <label className="form-label">ডেলিভারি এরিয়া *</label>
                      <select value={form.deliveryType} onChange={(e) => setForm({ ...form, deliveryType: e.target.value })} className="form-input">
                        <option value="inside_dhaka">ঢাকার ভিতরে (৳৬০)</option>
                        <option value="outside_dhaka">ঢাকার বাইরে (৳১২০)</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">এলাকা</label>
                      <input type="text" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="form-input" placeholder="যেমন: গুলশান, ধানমন্ডি" />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="font-bold text-lg mb-4">পেমেন্ট মাধ্যম</h2>
                  <div className="space-y-3">
                    {[
                      { value: "cod", label: "ক্যাশ অন ডেলিভারি (COD)", desc: "পণ্য হাতে পেয়ে টাকা দিন", icon: "fa-money-bill", color: "#059669" },
                      { value: "bkash", label: "bKash", desc: "01700000000 নাম্বারে সেন্ড মানি করে TrxID দিন", icon: "fa-mobile-alt", color: "#E2136E" },
                      { value: "nagad", label: "Nagad", desc: "01700000001 নাম্বারে সেন্ড মানি করে TrxID দিন", icon: "fa-wallet", color: "#F6921E" },
                      { value: "rocket", label: "Rocket", desc: "01700000002 নাম্বারে সেন্ড মানি করে TrxID দিন", icon: "fa-rocket", color: "#8B2F87" },
                    ].map((pm) => (
                      <label key={pm.value} className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${form.paymentMethod === pm.value ? "border-primary bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <input type="radio" name="paymentMethod" value={pm.value} checked={form.paymentMethod === pm.value} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <i className={`fas ${pm.icon}`} style={{ color: pm.color }}></i>
                            <span className="font-medium text-sm">{pm.label}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{pm.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {form.paymentMethod !== "cod" && (
                    <div className="mt-3">
                      <label className="form-label">ট্রানজেকশন আইডি (TrxID) *</label>
                      <input type="text" value={form.transactionId} onChange={(e) => setForm({ ...form, transactionId: e.target.value })} required className="form-input" placeholder="যেমন: TXN123456789" />
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="font-bold text-lg mb-4">অর্ডার নোট (অপশনাল)</h2>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="form-input" rows={2} placeholder="কোনো বিশেষ নির্দেশনা থাকলে লিখুন..."></textarea>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border p-5 sticky top-28">
                  <h3 className="font-bold text-lg mb-4">অর্ডার সামারি</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 py-2 border-b last:border-0">
                        <img src={item.image} className="w-12 h-12 rounded object-cover border" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium line-clamp-1">{item.name_bn}</p>
                          <p className="text-xs text-gray-400">x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold">৳{(item.price * item.quantity).toLocaleString("en-BD")}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">সাব টোটাল</span><span>৳{total.toLocaleString("en-BD")}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">ডেলিভারি</span><span>৳{deliveryCharge}</span></div>
                    {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>কুপন ({couponApplied})</span><span>-৳{couponDiscount}</span></div>}
                    <div className="flex justify-between font-bold text-base border-t pt-2"><span>সর্বমোট</span><span style={{ color: "#dc2626" }}>৳{grandTotal.toLocaleString("en-BD")}</span></div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex gap-2 mb-3">
                      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="কুপন কোড" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                      <button type="button" onClick={applyCoupon} className="px-3 py-2 border rounded-lg text-sm">Apply</button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-all disabled:opacity-50">
                    {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}অর্ডার কনফার্ম করুন
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <FooterClient />
    </>
  );
}
