import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function CashierPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [quantity, setQuantity] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const { data } = await axios.get("/api/products");
    setProducts(data);
  };

  const handleAddToCartPopup = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const existingItem = cart.find((item) => item._id === selectedProduct._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === selectedProduct._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...selectedProduct, quantity }]);
    }

    setQuantity(0);
    setSelectedProduct(null);
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const invoiceDetails = {
      items: cart,
      total: calculateTotal(),
      customer,
      date: new Date().toLocaleString(),
    };

    await axios.post("/api/reducestock", { items: cart });

    setInvoice(invoiceDetails);
    setCart([]);

    await fetchProducts(); // Ensures updated stock data is shown instantly
  };

  const handlePrintInvoice = () => {
    const doc = new jsPDF();
    console.log(doc.autoTable,"handlePrintInvoice");
    // Set document title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Invoice", 14, 15);
  
    // Draw a horizontal line
    doc.setLineWidth(0.5);
    doc.line(10, 20, 200, 20);
  
    // Customer details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${invoice.date}`, 14, 30);
    doc.text(`Customer: ${invoice.customer.name}`, 14, 40);
    doc.text(`Phone: ${invoice.customer.phone}`, 14, 50);
  
    // Define table headers and rows
    const tableColumn = ["Item", "Price (₹)", "Quantity", "Total (₹)"];
    const tableRows = invoice.items.map((item) => [
      item.name,
      item.price.toFixed(2),
      item.quantity,
      (item.price * item.quantity).toFixed(2),
    ]);
  
    // 👇 Correct way to call autoTable
    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { fontSize: 10, cellPadding: 3 },
    });
  
    // Calculate final Y position after the table
    const finalY = doc.lastAutoTable.finalY + 10;
  
    // Display total amount
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: ₹${invoice.total.toFixed(2)}`, 14, finalY);
  
    // Save the PDF
    doc.save(`invoice_${invoice.customer.name}_${invoice.customer.phone}.pdf`);
  };
  

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Billing Page</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Products</h2>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
            onClick={fetchProducts}
          >
            Load Products
          </button>
          {products.map((product) => (
            <div key={product._id} className="border p-2 mb-2">
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <p>Stock: {product.stock} kgs</p>
              <button
                className="bg-green-500 text-white py-1 px-3 rounded"
                onClick={() => handleAddToCartPopup(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Cart</h2>
          {cart.map((item) => (
            <div key={item._id} className="border p-2 mb-2 flex justify-between items-center">
              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price} x {item.quantity}</p>
              </div>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded"
                onClick={() => handleRemoveFromCart(item._id)}
              >
                Delete
              </button>
            </div>
          ))}
          <h3 className="text-lg font-bold mt-4">Total: ₹{calculateTotal()}</h3>
          <input
            type="text"
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            className="border p-2 w-full mb-2"
          />

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded relative w-80">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>
            <h2 className="text-xl mb-2">Add Quantity for {selectedProduct.name} in Kg</h2>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 w-full mb-4"
            />
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {invoice && (
        <div className="border p-4 mt-6">
          <h2 className="text-xl font-bold mb-2">Invoice</h2>
          <p>Date: {invoice.date}</p>
          {invoice.items.map((item) => (
            <div key={item._id}>
              <p>{item.name} - ₹{item.price} x {item.quantity}</p>
            </div>
          ))}
          <h3 className="text-lg font-bold mt-2">Total: ₹{invoice.total}</h3>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded mt-4"
            onClick={handlePrintInvoice}
          >
            Paid & Print Invoice
          </button>
        </div>
      )}
    </div>
  );
}
