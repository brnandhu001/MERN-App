import { useState, useEffect } from "react";

type ProductFormProps = {
  initialValues?: any;        // for edit mode
  onSubmit: (data: any) => void;
  buttonLabel: string;        // "Add Product" or "Update Product"
};

export default function ProductForm({
  initialValues,
  onSubmit,
  buttonLabel,
}: ProductFormProps) {

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  });

  // Prefill data when editing
  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || "",
        price: initialValues.price || "",
        category: initialValues.category || "",
        stock: initialValues.stock || "",
        image: initialValues.image || "",
        description: initialValues.description || "",
      });
    }
  }, [initialValues]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block font-medium mb-1">Product Name</label>
        <input
          name="name"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      {/* Price */}
      <div>
        <label className="block font-medium mb-1">Price</label>
        <input
          name="price"
          type="number"
          className="w-full border rounded px-3 py-2"
          value={formData.price}
          onChange={handleChange}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium mb-1">Category</label>
        <input
          name="category"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={formData.category}
          onChange={handleChange}
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block font-medium mb-1">Stock</label>
        <input
          name="stock"
          type="number"
          className="w-full border rounded px-3 py-2"
          value={formData.stock}
          onChange={handleChange}
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block font-medium mb-1">Image URL</label>
        <input
          name="image"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={formData.image}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          className="w-full border rounded px-3 py-2"
          rows={3}
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
