"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, ErrorText } from "@/styles/authStyles";

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
    <Form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <ErrorText>{error}</ErrorText>}
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit">Login</Button>
    </Form>
  );
}
