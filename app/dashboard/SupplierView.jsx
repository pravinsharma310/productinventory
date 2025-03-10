import { useEffect, useState } from "react";
import axios from "axios";

export default function SupplierPage() {
  const [products, setProducts] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Supplier Inventory Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>Stock Remaining: <span className={product.stock < 10 ? "text-red-500 font-bold" : "text-green-500"}>{product.stock} kg</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
