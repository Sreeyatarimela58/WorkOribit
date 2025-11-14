import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function LoginSignup() {
  // State for form data and UI toggle
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData.email, formData.password);
    if (res.ok) {
      const role = res.user.role;
      navigate(`/${role}`); // redirect to dashboard
    }
  };

  return (
    <div className="font-['Inter'] bg-[#121121] text-gray-300 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Injecting Fonts/Icons locally for standalone usage */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
      `}</style>

      {/* REMOVED h-[500px] - This allows the box to grow naturally to fit 
        the new "Name" field, preventing overflow.
      */}
      <div className="grid w-[90vw] h-[80vh] max-w-5xl grid-cols-1 overflow-hidden rounded-xl bg-gray-900/50 shadow-2xl lg:grid-cols-5 border border-gray-800">
        {/* LEFT BRAND PANEL */}
        <div className="hidden lg:col-span-2 lg:flex flex-col items-start justify-between bg-gradient-to-br from-[#4F46E5] to-[#9333EA] p-8 text-white relative overflow-hidden">
          {/* Content */}
          <div className="flex flex-col z-10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl">
                all_inclusive
              </span>
              <span className="text-2xl font-bold tracking-wider">
                WorkOrbit
              </span>
            </div>
            <p className="mt-4 max-w-sm text-lg text-white/80">
              Where Teams Find Their Flow
            </p>
          </div>

          {/* Decorative Image */}
          <div className="w-full z-10">
            <img
              className="aspect-square w-full max-w-sm rounded-lg object-cover opacity-30 mx-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtI7cZLtklcuFyxeQbtBV7lH8mHdz8FjcEC57rmqtledcaFe6TtXRJK7-iplRr37kwpdDp2BNglYWQjQEelbBxgHvNlCOL4S1Jtyev-rYrDftpRSuh6LcbupzN5CnRNv9WSJXIjFAptLJTc0ioQvkcmXwHq5uJOZmpLB0vAxDWrs96CXRFAVrVKuRYBzVcDyrsbFswPVz5DWTxXWRquNSI1F1oAMfYNGlM2SsCmjUD0gjUGHo4RD4EvBbYpf9eRbQpsddfHUTXFTI"
              alt="Abstract illustration of interconnected orbits and team collaboration concepts"
            />
          </div>

          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="lg:col-span-3 flex flex-col justify-center p-6 sm:p-10 lg:p-12 bg-gray-900/50">
          <div className="w-full max-w-md mx-auto">
            {error && (
              <p className="text-red-400 text-center text-sm mb-4">{error}</p>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ADDED: Name Field (Signup Only) */}
              {/* {mode === "create" && (
                <label className="flex flex-col group">
                  <p className="pb-2 text-base font-medium text-gray-200 group-focus-within:text-[#5048e5] transition-colors">
                    Name
                  </p>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="flex h-14 w-full rounded-xl border border-gray-600 bg-gray-800 p-[15px] text-base text-white placeholder:text-gray-500 focus:border-[#5048e5] focus:outline-none focus:ring-2 focus:ring-[#5048e5]/20 transition-all"
                    placeholder="Your Full Name"
                    required
                  />
                </label>
              )} */}

              {/* Email Field */}
              <label className="flex flex-col group">
                <p className="pb-2 text-base font-medium text-gray-200 group-focus-within:text-[#5048e5] transition-colors">
                  Email
                </p>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex h-14 w-full rounded-xl border border-gray-600 bg-gray-800 p-[15px] text-base text-white placeholder:text-gray-500 focus:border-[#5048e5] focus:outline-none focus:ring-2 focus:ring-[#5048e5]/20 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </label>

              {/* Password Field */}
              <label className="flex flex-col group">
                <p className="pb-2 text-base font-medium text-gray-200 group-focus-within:text-[#5048e5] transition-colors">
                  Password
                </p>
                <div className="flex w-full items-stretch relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="flex h-14 w-full rounded-l-xl border border-r-0 border-gray-600 bg-gray-800 p-[15px] text-base text-white placeholder:text-gray-500 focus:border-[#5048e5] focus:outline-none focus:ring-2 focus:ring-[#5048e5]/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <div
                    className="flex items-center justify-center rounded-r-xl border border-l-0 border-gray-600 bg-gray-800 pr-[15px] text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined select-none">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>
              </label>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="h-5 w-5 rounded border-2 border-gray-600 bg-transparent text-[#5048e5] focus:ring-[#5048e5]/50 focus:ring-offset-0 checked:bg-[#5048e5] checked:border-[#5048e5] transition-all cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-base text-gray-300 cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-base font-medium text-[#5048e5] hover:text-[#5048e5]/80 hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 pt-6">
                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-[#5048e5] px-5 text-base font-bold text-white transition-all hover:bg-[#5048e5]/90 active:scale-[0.98]"
                >
                  Login
                </button>

                {/* This is where the Google button was, it's removed per your code sample */}
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 text-center text-sm text-gray-500">
        © 2025 WorkOrbit. All rights reserved.
      </footer>
    </div>
  );
}
