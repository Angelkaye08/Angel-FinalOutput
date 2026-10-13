
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
    LayoutDashboard,
    Package,
    Boxes,
    CircleDollarSign,
    TriangleAlert,
    Plus,
    Search,
    Bell,
    ArrowUpRight,
    LogOut,
    Home,
    ClipboardList,
    Menu,
} from 'lucide-react';

const data = window.dashboardData || {};

const money = (value) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(value || 0));

function Dashboard() {
    const stats = [
        {
            label: 'Total Products',
            value: Number(data.totalProducts || 0).toLocaleString(),
            icon: Package,
            color: 'bg-blue-50 text-blue-600',
            note: 'Products in your inventory',
        },
        {
            label: 'Stock Quantity',
            value: Number(data.stockQuantity || 0).toLocaleString(),
            icon: Boxes,
            color: 'bg-violet-50 text-violet-600',
            note: 'Units currently recorded',
        },
        {
            label: 'Inventory Value',
            value: money(data.inventoryValue),
            icon: CircleDollarSign,
            color: 'bg-emerald-50 text-emerald-600',
            note: 'Based on quantity × price',
        },
        {
            label: 'Low-Stock Alerts',
            value: Number(data.lowStockProducts?.length || 0).toLocaleString(),
            icon: TriangleAlert,
            color: 'bg-amber-50 text-amber-600',
            note: 'Products shown below',
        },
    ];

    const [search, setSearch] = React.useState('');

    const products = (data.recentProducts || []).filter((product) =>
        `${product.name} ${product.sku} ${product.category}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
                <a href="/" className="flex items-center gap-3 px-6 py-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                        S
                    </div>
                    <div className="text-xl font-bold">
                        Stock<span className="text-blue-600">Pilot</span>
                    </div>
                </a>

                <p className="px-6 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Workspace
                </p>

                <nav className="space-y-2 px-3">
                    <a href="/dashboard" className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 font-semibold text-blue-700">
                        <LayoutDashboard size={19} />
                        Dashboard
                    </a>
                    <a href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
                        <Home size={19} />
                        Home
                    </a>
                    <a href="/products" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
                        <Package size={19} />
                        Products
                    </a>
                    <a href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
                        <ClipboardList size={19} />
                        Reports
                    </a>
                </nav>

                <div className="mt-auto border-t border-slate-100 p-5">
                    <div className="mb-3 text-sm font-semibold text-slate-700">
                        Inventory Management
                    </div>
                    <form action="/logout" method="POST">
                        <input
                            type="hidden"
                            name="_token"
                            value={document.querySelector(
                                'meta[name="csrf-token"]'
                            )?.content || ''}
                        />
                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600">
                            <LogOut size={18} />
                            Log out
                        </button>
                    </form>
                </div>
            </aside>

            <main className="lg:ml-64">
                <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Menu size={17} className="lg:hidden" />
                            Workspace / Dashboard
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Notifications"
                            className="rounded-xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-50"
                        >
                            <Bell size={19} />
                        </button>
                        <div className="hidden rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 sm:block">
                            Inventory Admin
                        </div>
                    </div>
                </header>

                <div className="space-y-8 p-5 sm:p-8">
                    <section className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 p-7 text-white shadow-lg shadow-blue-900/10 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-blue-100">
                                INVENTORY OVERVIEW
                            </p>
                            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                Welcome to your dashboard!
                            </h2>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                                Monitor your stock, review inventory value,
                                and keep track of products that need attention.
                            </p>
                        </div>

                        <a href="/products" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
                            <Plus size={19} />
                            Manage Products
                        </a>
                    </section>

                    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                {stat.label}
                                            </p>
                                            <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`rounded-xl p-3 ${stat.color}`}>
                                            <Icon size={22} />
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs text-slate-400">
                                        {stat.note}
                                    </p>
                                </article>
                            );
                        })}
                    </section>

                    <section className="grid gap-6 xl:grid-cols-2">
                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Low-Stock Alerts
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Products that may need restocking
                                    </p>
                                </div>
                                <TriangleAlert className="text-amber-500" size={22} />
                            </div>

                            <div className="divide-y divide-slate-100">
                                {(data.lowStockProducts || []).length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Package className="mx-auto text-emerald-500" size={30} />
                                        <p className="mt-3 font-semibold">No low-stock alerts</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Add products to start monitoring stock.
                                        </p>
                                    </div>
                                ) : (
                                    data.lowStockProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between gap-4 px-5 py-4">
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-slate-800">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    SKU: {product.sku}
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="font-bold text-amber-600">
                                                    {product.quantity} left
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    Threshold: {product.low_stock_threshold}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <a href="/products" className="flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-4 text-sm font-semibold text-blue-600 hover:bg-slate-50">
                                View products <ArrowUpRight size={16} />
                            </a>
                        </article>

                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <div className="border-b border-slate-100 px-5 py-5">
                                <h3 className="font-bold text-slate-900">
                                    Recent Products
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Your latest inventory entries
                                </p>
                            </div>

                            <div className="border-b border-slate-100 p-4">
                                <div className="relative">
                                    <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search recent products..."
                                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {products.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Package className="mx-auto text-slate-300" size={30} />
                                        <p className="mt-3 font-semibold text-slate-700">
                                            No products found
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Add products or try another search.
                                        </p>
                                    </div>
                                ) : (
                                    products.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between gap-3 px-5 py-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <Package size={19} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-slate-800">
                                                        {product.name}
                                                    </p>
                                                    <p className="mt-1 truncate text-xs text-slate-400">
                                                        {product.category} · {product.sku}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="font-semibold text-slate-800">
                                                    {product.quantity} units
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {money(product.price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <a href="/products" className="flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-4 text-sm font-semibold text-blue-600 hover:bg-slate-50">
                                Manage inventory <ArrowUpRight size={16} />
                            </a>
                        </article>
                    </section>

                    <footer className="pb-4 text-center text-sm text-slate-400">
                        © {new Date().getFullYear()} StockPilot Inventory Management
                    </footer>
                </div>
            </main>
        </div>
    );
}

createRoot(document.getElementById('dashboard-root')).render(<Dashboard />);
