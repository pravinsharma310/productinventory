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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get("/api/products");
    setProducts(data);
  };

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
    localStorage.removeItem(products.find(p => p._id === id)?.name);
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

  const handleImageUpload = (event, productName) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        localStorage.setItem(productName, e.target.result);
        setCurrentProduct({ ...currentProduct, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
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
      {!showReport ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border p-4 rounded-lg shadow-lg">
                <img
                  src={localStorage.getItem(product.name) || DEFAULT_IMAGE}
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
                  type="file"
                  className="border p-2 w-full mb-4"
                  onChange={(e) => handleImageUpload(e, currentProduct.name)}
                />
                <input
                  type="number"
                  placeholder="Stock (kg)"
                  className="border p-2 w-full mb-4"
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, stock: +e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  className="border p-2 w-full mb-4"
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, price: +e.target.value })
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
        </>
      ) : (
        <ReportPage />
      )}
    </div>
  );
}