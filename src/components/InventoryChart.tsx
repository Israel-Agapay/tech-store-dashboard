import type { FC } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
};

type Props = {
  products: Product[];
};

const COLORS = [
  "#378ADD",
  "#1D9E75",
  "#BA7517",
  "#E25C5C",
  "#A855F7",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

const InventoryChart: FC<Props> = ({ products }) => {
  const categoryData = Array.from(
    new Set(products.map((p) => p.category))
  ).map((catName, index) => ({
    name: catName,
    color: COLORS[index % COLORS.length],
    stock: products
      .filter((p) => p.category === catName)
      .reduce((total, p) => total + p.stock, 0),
  }));

  const maxStock = Math.max(...categoryData.map((c) => c.stock), 0);
  const roundedMax = Math.ceil(maxStock / 50) * 50 || 50;
  const steps = 5;
  const yLabels = Array.from({ length: steps + 1 }, (_, i) =>
    Math.round((roundedMax / steps) * (steps - i))
  );

  return (
    <div className="mx-6 mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">
            Inventory by category
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Current stock levels per category
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16.5 9.4 7.55 4.24" />
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" y1="22" x2="12" y2="12" />
          </svg>
          {categoryData.length} categories
        </span>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid gap-2.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {categoryData.map((cat) => (
          <div key={cat.name} className="rounded-lg bg-zinc-800 px-3.5 py-3">
            <p className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide text-zinc-400 truncate">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </p>
            <p className="text-2xl font-medium leading-none text-white">
              {cat.stock}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {categoryData.length === 0 ? (
        <p className="text-center text-zinc-500 py-10">No data available</p>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <div className="flex min-w-0" style={{ height: 220 }}>
            {/* Y-axis labels */}
            <div className="flex w-11 shrink-0 flex-col items-end justify-between pr-2 pb-7">
              {yLabels.map((val) => (
                <span key={val} className="text-[11px] leading-none text-zinc-500">
                  {val}
                </span>
              ))}
            </div>

            {/* Grid + Bars */}
            <div className="relative flex flex-1 min-w-0 flex-col pb-7">
              {/* Horizontal grid lines */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7">
                {yLabels.map((val) => (
                  <div key={val} className="w-full border-t border-zinc-800" />
                ))}
              </div>

              {/* Bars */}
              <div className="relative flex h-full items-end">
                {categoryData.map((cat) => {
                  const pct = (cat.stock / roundedMax) * 100;
                  return (
                    <div
                      key={cat.name}
                      className="flex flex-1 min-w-0 flex-col items-center justify-end px-1"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="relative flex w-full flex-col items-center justify-end"
                        style={{ height: "100%" }}
                      >
                        {/* Value label */}
                        <span
                          className="absolute text-xs font-medium text-white"
                          style={{
                            bottom: `calc(${pct}% + 6px)`,
                            left: "50%",
                            transform: "translateX(-50%)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cat.stock}
                        </span>

                        {/* Bar */}
                        <div
                          className="w-full max-w-[48px] rounded-t-md transition-opacity hover:opacity-80"
                          style={{
                            height: `${pct}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>

                      {/* X-axis label */}
                      <span className="mt-2 w-full text-center text-xs text-zinc-400 truncate px-1">
                        {cat.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {categoryData.map((cat) => (
          <span
            key={cat.name}
            className="flex items-center gap-1.5 text-xs text-zinc-400"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default InventoryChart;
