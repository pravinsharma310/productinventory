"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductManagement from "./ProductManagement";
import SupplierPage from "./SupplierView";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser,"storedUser")
    if (!storedUser) router.push("/login");
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // if (!user) return <p>Loading...</p>;
  console.log(user,"useruseruser")
  return (
    <div>
      {/* <h1>Welcome, {user.firstName} ({user.role})</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <button onClick={handleLogout}>Logout</button> */}
      {user?.type === "admin" && <ProductManagement />}
      {user?.type === "supplier" && <SupplierPage/>}
    </div>
  );
}
