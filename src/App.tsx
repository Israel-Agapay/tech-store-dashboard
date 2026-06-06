import ProductTable from './components/ProductTable'
import DashboardStats from './components/DashboardStats'
import { useEffect, useState } from "react";
import InventoryChart from './components/InventoryChart';
import toast from "react-hot-toast";
import Login from "./pages/Login";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  createdAt: string;
};

const App = () => {
    const [search, setSearch] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [name, setname] = useState<string>("")
    const [price, setPrice] = useState<number | "">("") 
    const [category, setCategory] = useState<string>("")
    const [stock, setstock] = useState<number | "">("")
    const [isEdit, setisEdit] = useState<string | null>(null)
    const [product, setProducts] = useState<Product[]>([])
    const [loading, setloading] = useState<boolean>(false)
    
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const [sortBy, setSortBy] = useState("default");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [userRole, setUserRole] = useState<string>("");

    const getAuthHeader = () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    const normalize = (str: string) =>
      str.trim().toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    const categories = [
      "All",
      ...new Set(product.map((p) => normalize(p.category))),
    ];

    const filteredProducts = product.filter((product) => {
      const macthessearch = product.name.toLowerCase().includes(search.toLowerCase())
      const filtered = selectedCategory === "All" || normalize(product.category) === selectedCategory
      return filtered && macthessearch
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "stock-low") return a.stock - b.stock;
      if (sortBy === "stock-high") return b.stock - a.stock;
      return 0;
    });

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

    const formattedCategory = category
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    useEffect(() => {
      if (!isLoggedIn) return;

      const getProducts = async () => {
        setloading(true);
        try {
          const [productsRes, userRes] = await Promise.all([
            fetch("https://tech-store-dashboard.onrender.com/products", { headers: getAuthHeader() }),
            fetch("https://tech-store-dashboard.onrender.com/me", { headers: getAuthHeader() }),
          ]);

          if (!productsRes.ok) throw new Error("Not able to fetch products");
          if (!userRes.ok) throw new Error("Not able to fetch user");

          const [productsData, userData] = await Promise.all([
            productsRes.json(),
            userRes.json(),
          ]);

          setProducts(productsData);
          setUserEmail(userData.email);
          setUserRole(userData.role);

        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        } finally {
          setloading(false);
        }
      };
      getProducts();
    }, [isLoggedIn]);

    const handleAdd = async () => {
      if (!name || price === "" || stock === "" || !category) {
        toast.error("Please fill all fields");
        return;
      }

      let autoStatus: "In Stock" | "Low Stock" | "Out of Stock";
      if (Number(stock) === 0) {
        autoStatus = "Out of Stock";
      } else if (Number(stock) <= 5) {
        autoStatus = "Low Stock";
      } else {
        autoStatus = "In Stock";
      }

      if (isEdit) {
        try {
          const response = await fetch(`https://tech-store-dashboard.onrender.com/products/${isEdit}`, {
            method: "PUT",
            headers: getAuthHeader(),
            body: JSON.stringify({
              name,
              price,
              stock,
              category: formattedCategory,
              status: autoStatus,
            }),
          });

          if (!response.ok) throw new Error("Failed to update product");

          const Data: Product = await response.json();
          const updateProducts = product.map((p) => p._id === isEdit ? Data : p);

          setProducts(updateProducts);
          toast.success("Product Updated Successfully");

          setisEdit(null);
          setname("");
          setPrice("");
          setstock("");
          setCategory("");
        } catch (error) {
          console.log(error);
          toast.error("Failed to update product");
        }
      } else {
        try {
          const response = await fetch("https://tech-store-dashboard.onrender.com/products", {
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify({
              name,
              price,
              stock,
              category: formattedCategory,
              status: autoStatus,
            }),
          });

          if (!response.ok) throw new Error("Failed to create product");

          const data: Product = await response.json();
          setProducts([...product, data]);
          toast.success("Product Added Successfully");

          setname("");
          setPrice("");
          setstock("");
          setCategory("");
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        } finally {
          setloading(false);
        }
      }
    };

    const handleDelete = async (id: string) => {
      try {
        const response = await fetch(`https://tech-store-dashboard.onrender.com/products/${id}`, {
          method: "DELETE",
          headers: getAuthHeader(),
        });

        if (!response.ok) throw new Error("Failed to delete product");

        const updated = product.filter((p) => p._id != id);
        setProducts(updated);
        toast.success("Product Deleted Successfully");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    };

    const exportToCSV = () => {
      const headers = ["Name", "Price", "Stock", "Category", "Status"];
      const rows = product.map((p) => [p.name, p.price, p.stock, p.category, p.status]);
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "products.csv";
      link.click();
      URL.revokeObjectURL(url);
    };

    if (!isLoggedIn) {
      return <Login onLogin={() => setIsLoggedIn(true)} />;
    }

    if (loading) {
      return (
        <div className="bg-zinc-950 min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-zinc-400">Loading products...</p>
          </div>
        </div>
      );
    }

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <div className="p-6">

          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">Tech Store Admin Dashboard</h1>
              <p className="text-zinc-400 mt-2 text-sm md:text-base">Manage products, inventory, and stock status.</p>
              <p className="text-zinc-500 text-sm mt-1">
                Welcome back, <span className="text-white font-semibold">{userEmail}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base">
                Export CSV
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                  setUserRole("");
                  setUserEmail("");
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base">
                Logout
              </button>
            </div>
          </div>

          {/* Add / Edit Product Form — Admin Only */}
          {userRole === "admin" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                {isEdit ? "Edit Product" : "Add Product"}
              </h2>
              <div className={`grid grid-cols-1 gap-4 ${isEdit ? "md:grid-cols-4" : "md:grid-cols-5"}`}>
                <input
                  type="text"
                  placeholder="Product title"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") { setPrice(""); return; }
                    const Num1 = Number(value);
                    if (Num1 < 0) return;
                    setPrice(Num1);
                  }}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 outline-none"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") { setstock(""); return; }
                    const Num2 = Number(value);
                    if (Num2 < 0) return;
                    setstock(Num2);
                  }}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 outline-none"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 outline-none placeholder:text-zinc-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="bg-white text-black rounded-lg px-4 py-3 font-semibold hover:bg-zinc-300 transition w-full"
                  >
                    {isEdit ? "Update Product" : "Add Product"}
                  </button>
                  {isEdit && (
                    <button
                      onClick={() => {
                        setisEdit(null);
                        setname("");
                        setPrice("");
                        setstock("");
                        setCategory("");
                      }}
                      className="bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-4 py-3 font-semibold transition w-full"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        <DashboardStats products={filteredProducts} userRole={userRole} />
        {userRole === "admin" && (
          <InventoryChart products={filteredProducts} />
        )}

        {/* Search, Filter, Sort */}
        <div className="flex flex-col md:flex-row pt-10 gap-4 px-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 w-full outline-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock-low">Stock: Low to High</option>
            <option value="stock-high">Stock: High to Low</option>
          </select>
        </div>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-96">
              <h2 className="text-xl font-bold text-white mb-4">{selectedProduct.name}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Price</span>
                  <span className="text-white">₱{selectedProduct.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Stock</span>
                  <span className="text-white">{selectedProduct.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Category</span>
                  <span className="text-white">{selectedProduct.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status</span>
                  <span className="text-white">{selectedProduct.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date Created</span>
                  <span className="text-white">
                    {new Date(selectedProduct.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="mt-6 w-full bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <ProductTable
          products={paginatedProducts}
          OnDelete={(id) => setDeleteId(id)}
          OnView={(product) => setSelectedProduct(product)}
          userRole={userRole}
          IsEdit={(product) => {
            setisEdit(product._id);
            setname(product.name);
            setPrice(product.price);
            setCategory(product.category);
            setstock(product.stock);
          }}
        />

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-zinc-800 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-zinc-800 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-96">
            <h2 className="text-xl font-bold text-white">Delete Product</h2>
            <p className="text-zinc-400 mt-2">Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
