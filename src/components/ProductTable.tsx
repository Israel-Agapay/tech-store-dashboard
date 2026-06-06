import type { Products } from '../types/product'

type ProductTableProps = {
  products: Products[];
  OnDelete: (id: string) => void;
  IsEdit: (product: Products) => void;
  OnView: (product: Products) => void;
  userRole: string;
};

const statusStyles: Record<string, string> = {
  "In Stock": "bg-green-500/20 text-green-400",
  "Low Stock": "bg-yellow-500/20 text-yellow-400",
  "Out of Stock": "bg-red-500/20 text-red-400",
};

const ProductTable = ({ products, OnDelete, IsEdit, OnView, userRole }: ProductTableProps) => {
  return (
    <div className="p-4 md:p-6">

      {/* Mobile View */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.map((product) => (
          <div
            key={product._id}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 cursor-pointer"
            onClick={() => OnView(product)}
          >
            {/* Name + Status */}
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="font-semibold text-white leading-tight">
                {product.name}
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  statusStyles[product.status] ?? "bg-zinc-700 text-zinc-300"
                }`}
              >
                {product.status}
              </span>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                { label: "Price", value: `₱${product.price.toLocaleString()}` },
                { label: "Category", value: product.category },
                { label: "Stock", value: product.stock },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-zinc-800 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white truncate">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions — admin only */}
            {userRole === "admin" && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); IsEdit(product); }}
                  className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-semibold transition hover:bg-green-600 active:scale-95"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); OnDelete(product._id); }}
                  className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold transition hover:bg-red-600 active:scale-95"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto rounded-xl">
        <table className="w-full">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              {["Product", "Price", "Category", "Stock", "Status", ...(userRole === "admin" ? ["Actions"] : [])].map(
                (col) => (
                  <th
                    key={col}
                    className="p-3 text-left text-sm font-semibold text-zinc-300"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-zinc-800 transition hover:bg-zinc-900/50 cursor-pointer"
                onClick={() => OnView(product)}
              >
                <td className="p-3 font-medium text-white">{product.name}</td>
                <td className="p-3 text-zinc-300">₱{product.price.toLocaleString()}</td>
                <td className="p-3 text-zinc-300">{product.category}</td>
                <td className="p-3 text-zinc-300">{product.stock}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      statusStyles[product.status] ?? "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                {userRole === "admin" && (
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); IsEdit(product); }}
                        className="rounded-lg bg-green-500 px-5 py-1.5 text-sm font-semibold transition hover:bg-green-600 active:scale-95"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); OnDelete(product._id); }}
                        className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold transition hover:bg-red-600 active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ProductTable;
