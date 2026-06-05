import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Map, LogIn, UserPlus, Users, Shield, User, Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Login Page
 * Current Status: Frontend login page — being built
 * 
 * Features:
 *   - Email/password login
 *   - New account registration
 *   - Team selection during registration
 */

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"commercial" | "directeur">("commercial");

  // Demo users for quick login (bypasses server)
  const demoUsers = [
    { label: "Directeur", name: "Karim Benali", email: "directeur@demo.com", color: "bg-red-100 text-red-700 hover:bg-red-200", icon: <Shield size={14} /> },
    { label: "Resp. Eq. 1", name: "Sara El Amrani", email: "resp1@demo.com", color: "bg-purple-100 text-purple-700 hover:bg-purple-200", icon: <Users size={14} /> },
    { label: "Resp. Eq. 2", name: "Youssef Idrissi", email: "resp2@demo.com", color: "bg-purple-100 text-purple-700 hover:bg-purple-200", icon: <Users size={14} /> },
    { label: "Commercial A", name: "Fatima Zahra", email: "com1@demo.com", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200", icon: <User size={14} /> },
    { label: "Commercial B", name: "Omar Farouk", email: "com2@demo.com", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200", icon: <User size={14} /> },
    { label: "Commercial C", name: "Laila Bennani", email: "com3@demo.com", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200", icon: <User size={14} /> },
    { label: "Commercial D", name: "Hassan Moussaoui", email: "com4@demo.com", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200", icon: <User size={14} /> },
  ];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store token and redirect
      localStorage.setItem("auth_token", data.token);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role: regRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // Store token and redirect
      localStorage.setItem("auth_token", data.token);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  function handleDemoLogin(email: string) {
    // Demo mode — create a fake session for development
    const demoUser = demoUsers.find((u) => u.email === email);
    if (!demoUser) return;

    localStorage.setItem(
      "auth_token",
      "demo_" + btoa(JSON.stringify({ email, name: demoUser.name, role: demoUser.label }))
    );
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1E3A5F] flex items-center justify-center mx-auto mb-4">
            <Map size={32} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Cartographie Interactive
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Consultation et Appel d&apos;Offres
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Toggle Login/Register */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === "login" ? "default" : "outline"}
            className={mode === "login" ? "bg-[#1E3A5F] flex-1" : "flex-1"}
            onClick={() => { setMode("login"); setError(""); }}
          >
            <LogIn size={16} className="mr-2" />
            Connexion
          </Button>
          <Button
            variant={mode === "register" ? "default" : "outline"}
            className={mode === "register" ? "bg-[#1E3A5F] flex-1" : "flex-1"}
            onClick={() => { setMode("register"); setError(""); }}
          >
            <UserPlus size={16} className="mr-2" />
            Nouveau compte
          </Button>
        </div>

        {/* Login Form */}
        {mode === "login" && (
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-base">Se connecter</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#1E3A5F] hover:bg-[#152D4A]"
                  disabled={loading}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-base">Creer un compte</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="reg-name">Nom complet</Label>
                  <Input
                    id="reg-name"
                    placeholder="Karim Benali"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="nom@entreprise.ma"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 caracteres"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      type="button"
                      variant={regRole === "commercial" ? "default" : "outline"}
                      className={regRole === "commercial" ? "bg-emerald-600 flex-1" : "flex-1"}
                      onClick={() => setRegRole("commercial")}
                    >
                      <User size={14} className="mr-1" />
                      Commercial
                    </Button>
                    <Button
                      type="button"
                      variant={regRole === "directeur" ? "default" : "outline"}
                      className={regRole === "directeur" ? "bg-red-600 flex-1" : "flex-1"}
                      onClick={() => setRegRole("directeur")}
                    >
                      <Shield size={14} className="mr-1" />
                      Directeur
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#1E3A5F] hover:bg-[#152D4A]"
                  disabled={loading}
                >
                  {loading ? "Creation..." : "Creer le compte"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Demo Mode */}
        <Card className="mt-4 border-dashed border-2 border-amber-300 bg-amber-50/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm text-amber-800 flex items-center justify-center gap-2">
              <Users size={16} />
              Mode Demo (sans serveur)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-700 text-center mb-3">
              Cliquez pour tester avec un role predefini
            </p>
            <div className="space-y-1.5">
              {demoUsers.map((u) => (
                <Button
                  key={u.email}
                  variant="outline"
                  className={`w-full justify-between ${u.color} border-transparent h-9`}
                  onClick={() => handleDemoLogin(u.email)}
                >
                  <span className="flex items-center gap-2 text-xs">
                    {u.icon}
                    <span className="font-medium">{u.label}</span>
                    <span className="opacity-70">— {u.name}</span>
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    Demo
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-gray-400 text-center mt-4">
          Cartographie Collaborative v1.0 — Service Commercial
        </p>
      </div>
    </div>
  );
}
