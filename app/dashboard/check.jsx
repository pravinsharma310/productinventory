import { useEffect, useState } from "react";
import axios from "axios";
import ReportPage from "./ReportView";

const DEFAULT_IMAGE = "/images/defaultImage.png";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const fetchProducts = async () => {
    const { data } = await axios.get("/api/products");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleAddProduct = () => {
    setCurrentProduct({ name: "", image: "", stock: 0, price: 0 });
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (id) => {
    await axios.delete("/api/products", { data: { id } });
    await fetchProducts();
  };

  const updateProduct = async (updatedProduct) => {
    await axios.put("/api/products", updatedProduct);
    await fetchProducts();
    setShowEditModal(false);
  };

  const addNewProduct = async (newProduct) => {
    await axios.post("/api/products", newProduct);
    await fetchProducts();
    setShowAddModal(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{showReport ? "Report" : "Products"}</h1>
        <div className="flex gap-2">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={() => setShowReport(!showReport)}
          >
            {showReport ? "View Products" : "View Report"}
          </button>
          {!showReport && (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          )}
        </div>
      </div>

      {showReport ? (
        <ReportPage />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow-lg">
              <img
                src={DEFAULT_IMAGE}
                alt={product.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p>Stock: {product.stock} kg</p>
              <p>Price: ₹{product.price}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-yellow-500 text-white py-1 px-3 rounded"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
