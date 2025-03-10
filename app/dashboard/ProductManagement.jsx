import { useEffect, useState } from "react";
import axios from "axios";
// import defaultImage from "./asserts/defaultImage.png"
const DEFAULT_IMAGE = "/images/defaultImage.png"; // Default avatar image path

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (id) => {
    await axios.delete("/api/products", { data: { id } });
    setProducts((prev) => prev.filter((product) => product._id !== id));
  };

  const updateProduct = async (updatedProduct) => {
    const { data } = await axios.put("/api/products", updatedProduct);
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct.id ? data.product : p))
    );
    setShowEditModal(false);
  };

  const addNewProduct = async (newProduct) => {
    const { data } = await axios.post("/api/products", newProduct);
    setProducts((prev) => [...prev, data.product]);
    setShowAddModal(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-lg">
            <img
              src={DEFAULT_IMAGE} // Use default avatar if no image
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>Stock: {product.stock} kg</p>
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

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <input
              type="number"
              value={currentProduct.stock}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, stock: +e.target.value })
              }
              className="border p-2 w-full mb-4"
            />
            <button
              className="bg-green-500 text-white py-1 px-3 rounded"
              onClick={() => updateProduct(currentProduct)}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white py-1 px-3 rounded ml-2"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              className="border p-2 w-full mb-4"
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Image URL"
              className="border p-2 w-full mb-4"
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, image: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Stock (kg)"
              className="border p-2 w-full mb-4"
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, stock: +e.target.value })
              }
            />
            <button
              className="bg-green-500 text-white py-1 px-3 rounded"
              onClick={() => addNewProduct(currentProduct)}
            >
              Add Product
            </button>
            <button
              className="bg-red-500 text-white py-1 px-3 rounded ml-2"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
