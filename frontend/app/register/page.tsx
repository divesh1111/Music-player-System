"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Switch straight to login after successful register
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500 mb-2">
            Create Account
          </h1>
          <p className="text-zinc-400">Join the Music Explorer</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Username</label>
            <input
              type="text"
              required
              suppressHydrationWarning
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors"
              placeholder="Pick a username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Password</label>
            <input
              type="password"
              required
              suppressHydrationWarning
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            suppressHydrationWarning
            className="w-full py-4 text-black bg-gradient-to-r from-fuchsia-400 to-violet-500 hover:from-fuchsia-300 hover:to-violet-400 font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-8 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
