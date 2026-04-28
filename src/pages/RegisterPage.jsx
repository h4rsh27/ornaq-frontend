import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { User, Mail, Lock, Phone, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join the Club"
      subtitle="Unlock exclusive collections, personalized styling, and early access to drops."
      image="/src/assets/hero-banner.png"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Create Account</h1>
        <p className="mt-2 text-stone-500 text-sm">Fill in your details to get started.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            required
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 pl-12 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        
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
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            required
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 pl-12 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            required
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 pl-12 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            type="password"
            placeholder="Create Password (min 6 chars)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 p-4 font-bold text-white transition-all hover:bg-stone-800 disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Join ORNAQ"}
          {!loading && <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-brand-700 hover:underline">
          Sign in instead
        </Link>
      </p>

      <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-stone-400">
        By joining, you agree to our Terms and Privacy Policy.
      </p>
    </AuthLayout>
  );
}
