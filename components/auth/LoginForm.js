"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LOGIN = "/images/vegmarket.jpg";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user.user));
      router.push("/dashboard");
    } else {
      setError(data.message);
    }
  };

  return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        {/* Image Section */}
        <div className="flex justify-center mb-6">
          <Image
            src={LOGIN}
            alt="Login Illustration"
            width={320}
            height={180}
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Welcome Back</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md"
          >
            Login
          </button>

          {/* Register Button */}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
