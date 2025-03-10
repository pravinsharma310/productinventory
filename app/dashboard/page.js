"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductManagement from "./ProductManagement";
import SupplierPage from "./SupplierView";
import CashierPage from "./CashierView";
import Header from "./Header";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [title,setTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser,"storedUser")
    if (!storedUser) router.push("/login");
    setUser(storedUser);
    if(storedUser?.type === "admin"){
      setTitle("Admin Management")
    }else if(storedUser?.type === "supplier"){
      setTitle("Supplier Management")
    } else if(storedUser?.type === "cashier"){
      setTitle("Cashier Management")
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // if (!user) return <p>Loading...</p>;
  console.log(user,"useruseruser")
  return (
    <div>
      {user && <Header title={title} user={user} onLogout={handleLogout} />}
      {user?.type === "admin" && <ProductManagement />}
      {user?.type === "supplier" && <SupplierPage/>} 
      {user?.type === "cashier" && <CashierPage/>} 
    </div>
  );
}
