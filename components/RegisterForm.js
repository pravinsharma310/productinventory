"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Select, Button, ErrorText } from "@/styles/authStyles";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    type: "user",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } else {
      setError(data.message);
    }
  };

  return (
    <Form onSubmit={handleRegister}>
      <h2>Register</h2>
      {error && <ErrorText>{error}</ErrorText>}
      <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
      <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <Input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
      <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <Select name="type" value={formData.type} onChange={handleChange}>
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
          <option value="supplier">Supplier</option>      
      </Select>
      <Button type="submit">Register</Button>
    </Form>
  );
}
