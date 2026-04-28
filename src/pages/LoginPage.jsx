import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { Mail, Lock, Phone, ArrowRight } from "lucide-react";

// Lightweight JWT payload decoder for Google credential (no external lib needed)
const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, requestOtp, verifyOtp, googleLogin } = useAuth();
  const [activeTab, setActiveTab] = useState("password"); // 'password' or 'otp'
  const [form, setForm] = useState({ email: "", password: "", phone: "", otp: "" });
  const [otpRequested, setOtpRequested] = useState(false);
  const [previewCode, setPreviewCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitPasswordLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitOtpRequest = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await requestOtp({ phone: form.phone });
      setOtpRequested(true);
      setPreviewCode(response.previewCode || "");
      // Optional: Add a toast or message here
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const submitOtpVerify = async () => {
    setError("");
    setLoading(true);
    try {
      await verifyOtp({ phone: form.phone, otp: form.otp });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Experience the finest curated fashion and lifestyle essentials."
      image="/src/assets/hero-banner.png"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Sign In</h1>
        <p className="mt-2 text-stone-500 text-sm">Choose your preferred login method.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-2xl bg-stone-100 p-1">
        <button
          onClick={() => setActiveTab("password")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
            activeTab === "password" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setActiveTab("otp")}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
            activeTab === "otp" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Mobile OTP
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "password" ? (
          <motion.form
            key="password"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={submitPasswordLogin}
            className="space-y-4"
          >
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                required
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 pl-12 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                required
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 pl-12 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" virtual="true" className="text-xs font-semibold text-brand-700 hover:underline">
                Forgot Password?
              </Link>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 p-4 font-bold text-white transition-all hover:bg-stone-800 disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Login to Account"}
              {!loading && <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            {!otpRequested ? (
              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    required
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 pl-12 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                    placeholder="10-digit Mobile Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  onClick={submitOtpRequest}
                  disabled={loading || !form.phone}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 p-4 font-bold text-white transition-all hover:bg-stone-800 disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send OTP"}
                  {!loading && <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-stone-500">OTP sent to your mobile. Enter the 6-digit code below.</p>
                <input
                  required
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center text-2xl font-bold tracking-[0.5em] transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  placeholder="------"
                  maxLength={6}
                  value={form.otp}
                  onChange={(e) => setForm({ ...form, otp: e.target.value })}
                />
                {previewCode && (
                  <div className="rounded-xl bg-brand-50 p-3 text-center text-xs text-brand-700">
                    Dev Mode OTP: <span className="font-bold">{previewCode}</span>
                  </div>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  onClick={submitOtpVerify}
                  disabled={loading || form.otp.length < 4}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 p-4 font-bold text-white transition-all hover:bg-stone-800 disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                  {!loading && <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />}
                </button>
                <button
                  onClick={() => setOtpRequested(false)}
                  className="w-full text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Edit phone number
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-stone-400">Or continue with</span>
        </div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            setError("");
            setLoading(true);
            try {
              const payload = decodeJwtPayload(credentialResponse.credential);
              if (!payload?.email || !payload?.name) {
                setError("Google login failed: unable to read profile.");
                setLoading(false);
                return;
              }
              await googleLogin({
                email: payload.email,
                name: payload.name,
                googleId: payload.sub,
                avatar: payload.picture || ""
              });
              navigate("/");
            } catch (err) {
              setError("Google login failed");
            } finally {
              setLoading(false);
            }
          }}
          onError={() => {
            setError("Google Login Failed");
          }}
          useOneTap
          theme="outline"
          shape="pill"
          width="100%"
        />
      </div>

      <p className="mt-8 text-center text-sm text-stone-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-bold text-brand-700 hover:underline">
          Create one now
        </Link>
      </p>
    </AuthLayout>
  );
}
