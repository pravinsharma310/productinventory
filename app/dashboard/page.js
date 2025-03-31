"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductManagement from "./ProductManagement";
import SupplierPage from "./SupplierView";
import CashierPage from "./CashierView";
import Header from "./Header";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) router.push("/login");
    setUser(storedUser);
    if (storedUser?.type === "admin") {
      setTitle("Admin Management");
    } else if (storedUser?.type === "supplier") {
      setTitle("Supplier Management");
    } else if (storedUser?.type === "cashier") {
      setTitle("Cashier Management");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="relative w-full h-screen">
      {/* Local Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/images/bgimage.webp')" }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10">
        {user && <Header title={title} user={user} onLogout={handleLogout} />}
        {(user?.type === "admin" || user?.type === "user") && <ProductManagement />}
        {user?.type === "supplier" && <SupplierPage />}
        {user?.type === "cashier" && <CashierPage />}
      </div>
    </div>
  );
}
