import { useEffect, useState } from "react";
import Modal from "../components/modal";

type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  stock: number;
};

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const openAddModal = () => {
    setModalType("add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalType("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setModalType("delete");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    await fetch(`http://localhost:3000/api/products/${selectedProduct._id}`, {
      method: "DELETE",
    });

    setProducts(products.filter(p => p._id !== selectedProduct._id));

    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
     <div className="overflow-x-auto">
  <table className="min-w-full text-sm text-left bg-white shadow-lg rounded-lg overflow-hidden">
    <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <tr>
        <th className="px-6 py-3">Image</th>
        <th className="px-6 py-3">Name</th>
        <th className="px-6 py-3">Price (₹)</th>
        <th className="px-6 py-3">Category</th>
        <th className="px-6 py-3">Stock</th>
        <th className="px-6 py-3 text-center">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      {products.map((item) => (
        <tr
          key={item._id}
          className="hover:bg-gray-50 transition-all duration-200"
        >
          {/* Image */}
          <td className="px-6 py-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-14 h-14 rounded-md object-cover shadow"
            />
          </td>

          {/* Name */}
          <td className="px-6 py-4 font-medium">{item.name}</td>

          {/* Price */}
          <td className="px-6 py-4 font-semibold text-green-600">
            ₹{item.price}
          </td>

          {/* Category */}
          <td className="px-6 py-4">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
              {item.category}
            </span>
          </td>

          {/* Stock */}
          <td className="px-6 py-4">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                item.stock > 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
            </span>
          </td>

          {/* Actions */}
          <td className="px-6 py-4 flex justify-center gap-3">
            <button
              onClick={() => openEditModal(item)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow transition-all"
            >
              Edit
            </button>

            <button
              onClick={() => openDeleteModal(item)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition-all"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === "add"
            ? "Add Product"
            : modalType === "edit"
            ? "Edit Product"
            : "Delete Product"
        }
      >
        {/* ADD MODAL */}
        {modalType === "add" && (
          <div>
            <p>Add product form goes here...</p>
          </div>
        )}

        {/* EDIT MODAL */}
        {modalType === "edit" && selectedProduct && (
          <div>
            <p>Edit product form for: {selectedProduct.name}</p>
          </div>
        )}

        {/* DELETE MODAL */}
        {modalType === "delete" && selectedProduct && (
          <div>
            <p>Are you sure you want to delete <b>{selectedProduct.name}</b>?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Dashboard;
