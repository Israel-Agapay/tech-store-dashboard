import type { Products } from "../types/product";

type DashboardStatsProps = {
  products: Products[];
  userRole: string; 
};

const DashboardStats = ({ products, userRole }: DashboardStatsProps) => {

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, p) => total + p.stock,
    0
  );

  const totalInventoryValue = products.reduce(
    (total, p) => total + p.price * p.stock,
    0
  );

  const inStock = products.filter(
    (p) => p.status === "In Stock"
  ).length;

  const lowStock = products.filter(
    (p) => p.status === "Low Stock"
  ).length;

  const outOfStock = products.filter(
    (p) => p.status === "Out of Stock"
  ).length;

  return (
    <div className={`grid grid-cols-1 gap-4 p-6 ${userRole === "admin" ? "md:grid-cols-3 lg:grid-cols-6" : "md:grid-cols-2 lg:grid-cols-5"}`}>

      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
        <h2 className="text-zinc-400 text-sm">
          Total Products
        </h2>
        <p className="text-3xl font-bold mt-2">
          {totalProducts}
        </p>
      </div>

      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
        <h2 className="text-zinc-400 text-sm">
          Total Stock
        </h2>
        <p className="text-3xl font-bold mt-2">
          {totalStock}
        </p>
      </div>

      {userRole === "admin" && (
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <h2 className="text-zinc-400 text-sm">
            Inventory Value
          </h2>
          <p className="text-2xl font-bold mt-2">
            ₱{totalInventoryValue.toLocaleString()}
          </p>
        </div>
      )}

      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
        <h2 className="text-zinc-400 text-sm">
          In Stock
        </h2>
        <p className="text-3xl font-bold mt-2">
          {inStock}
        </p>
      </div>

      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
        <h2 className="text-zinc-400 text-sm">
          Low Stock
        </h2>
        <p className="text-3xl font-bold mt-2">
          {lowStock}
        </p>
      </div>

      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
        <h2 className="text-zinc-400 text-sm">
          Out of Stock
        </h2>
        <p className="text-3xl font-bold mt-2">
          {outOfStock}
        </p>
      </div>

    </div>
  );
};

export default DashboardStats;