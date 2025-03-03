"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) router.push("/login");
    setUser(storedUser.user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return <p>Loading...</p>;
  console.log(user,"useruseruser")
  return (
    <div>
      <h1>Welcome, {user.firstName} ({user.role})</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
