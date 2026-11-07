import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { demoStorage } from '../services/storage';

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 600));

    const user = demoStorage.login(identifier, password);

    if (!user) {
      setError("Login gagal. Silakan coba lagi.");
      setIsLoading(false);
      return;
    }

    demoStorage.setCurrentUser(user);

    if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (user.role === "operator") {
      navigate("/operator/dashboard", { replace: true });
    } else {
      navigate("/viewer/dashboard", { replace: true });
    }
  };

  const quickLogin = (u) => {
    setIdentifier(u.username);
    setPassword(u.password);
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/bg.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md mx-4 text-center">
        <img src="/assets/logo.jpg" alt="Logo" className="w-24 h-24 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-6 leading-snug" style={{ color: "#3674B5" }}>
          Fakultas Sains dan Teknologi <br /> Universitas Jambi
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <User className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Username atau Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="flex-1 outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: "#3674B5" }}
            className="w-full text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            {isLoading ? "Loading..." : "LOGIN"}
          </button>
        </form>

        <div className="text-right mt-4">
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition">
            Lupa Password?
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">Coba akun demo</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Admin", username: "admin", password: "admin123" },
              { label: "Operator", username: "operator", password: "operator123" },
              { label: "Viewer", username: "viewer", password: "viewer123" },
            ].map((acc) => (
              <button key={acc.username} onClick={() => quickLogin(acc)} className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded border border-gray-200 transition">
                {acc.label} ({acc.username})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
