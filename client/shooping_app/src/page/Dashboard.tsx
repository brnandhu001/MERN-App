import { useEffect, useState } from "react";
import Modal from "../components/modal";
import ProductForm from "../components/ProductForm";

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
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sorting
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // items per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [sortField, sortOrder, page]); // auto update on sort + page

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/products?page=${page}&limit=${limit}&sort=${sortField}&order=${sortOrder}`
      );

      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Modal Controls
  const openAddModal = () => {
    setModalType("add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleAddProduct = async (data: any) => {
  await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  fetchProducts(); // reload table
  setIsModalOpen(false);
};

const handleUpdateProduct = async (data: any) => {
  if (!selectedProduct) return;

  await fetch(`http://localhost:3000/api/products/${selectedProduct._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  fetchProducts();
  setIsModalOpen(false);
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

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    await fetch(`http://localhost:3000/api/products/${selectedProduct._id}`, {
      method: "DELETE",
    });

    setProducts(products.filter((p) => p._id !== selectedProduct._id));
    setIsModalOpen(false);
  };

  // Sorting Handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3">Image</th>

              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortField === "name" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("price")}
              >
                Price (₹){" "}
                {sortField === "price" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("category")}
              >
                Category{" "}
                {sortField === "category" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("stock")}
              >
                Stock{" "}
                {sortField === "stock" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>

              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {products.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                {/* IMAGE */}
                <td className="px-6 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-md object-cover shadow"
                  />
                </td>

                {/* NAME */}
                <td className="px-6 py-4 font-medium">{item.name}</td>

                {/* PRICE */}
                <td className="px-6 py-4 text-green-600 font-semibold">
                  ₹{item.price}
                </td>

                {/* CATEGORY */}
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                    {item.category}
                  </span>
                </td>

                {/* STOCK */}
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

                {/* ACTIONS */}
                <td className="px-6 py-4 flex justify-center gap-3">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDeleteModal(item)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* MODAL */}
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
  <ProductForm
    buttonLabel="Add Product"
    onSubmit={handleAddProduct}
  />
)}


        {/* EDIT MODAL */}
  {modalType === "edit" && selectedProduct && (
  <ProductForm
    initialValues={selectedProduct}
    buttonLabel="Update Product"
    onSubmit={handleUpdateProduct}
  />
)}


        {/* DELETE MODAL */}
        {modalType === "delete" && selectedProduct && (
          <div>
            <p>
              Are you sure you want to delete{" "}
              <b>{selectedProduct.name}</b>?
            </p>
            <div className="flex justify-end mt-4 space-x-2">
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
