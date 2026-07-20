import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import supabase from "../../lib/supabase";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // If already logged in, redirect to admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/admin");
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Tự động thêm đuôi @benthuyen.local nếu chỉ nhập tên tài khoản (username)
      const finalEmail = email.includes("@") 
        ? email.trim() 
        : `${email.trim()}@benthuyen.local`;

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password: password,
      });

      if (authError) {
        throw authError;
      }

      if (data?.session) {
        navigate("/admin");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      // Translate common error messages
      if (err.message === "Invalid login credentials") {
        setError("Email hoặc mật khẩu không chính xác.");
      } else {
        setError("Đã xảy ra lỗi đăng nhập: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-50 px-6 select-none">
      <div className="relative w-full max-w-md">
        {/* Background Decorative Glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-secondary/10 to-primary/10 opacity-50 blur-[15px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-slate-100 bg-white p-8 md:p-10 shadow-2xl text-slate-800"
        >
          {/* Logo / Title */}
          <div className="mb-8 text-center">
            <img
              src="/logo/logo_scroll.png"
              alt="NS Bến Thuyền"
              className="mx-auto mb-4 h-16 w-auto object-contain"
            />
            <h2 className="font-sans text-xl tracking-wider uppercase text-primary font-bold">
              Hệ Thống Quản Trị
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Đăng nhập để quản lý nội dung website
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 flex items-center space-x-2.5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-600"
            >
              <FiAlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-extrabold tracking-[0.2em] text-slate-500 uppercase mb-2">
                Tài khoản
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FiMail size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm text-slate-850 placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-sm"
                  placeholder="Nhập tên tài khoản..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold tracking-[0.2em] text-slate-500 uppercase mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <FiLock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm text-slate-850 placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white flex w-full items-center justify-center rounded-lg py-3.5 text-xs font-bold tracking-[0.2em] uppercase shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
