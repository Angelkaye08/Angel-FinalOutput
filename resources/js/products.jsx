
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    LayoutDashboard,
    Package,
    Search,
    Plus,
    Pencil,
    Trash2,
    Boxes,
    CircleDollarSign,
    TriangleAlert,
    X,
    LoaderCircle,
    RefreshCw,
    Home,
    LogOut,
} from 'lucide-react';

const emptyForm = {
    name: '',
    sku: '',
    category: 'General',
    quantity: '0',
    price: '',
    low_stock_threshold: '10',
};

const money = (value) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(value || 0));

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState(null);

    const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
    )?.content || '';

    async function loadProducts() {
        setLoading(true);

        try {
            const response = await fetch('/products/data', {
                credentials: 'same-origin',
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new Error(
                    response.status === 401 || response.status === 403
                        ? 'Please log in to view your products.'
                        : 'Unable to load products.'
                );
            }

            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            setNotice({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    const categories = useMemo(
        () => [
            'All',
            ...new Set(products.map((p) => p.category).filter(Boolean)),
        ],
        [products]
    );

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch = [
                product.name,
                product.sku,
                product.category,
            ].some((value) =>
                String(value || '').toLowerCase().includes(term)
            );

            const matchesCategory =
                categoryFilter === 'All' ||
                product.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter]);

    const lowStockCount = products.filter(
        (product) =>
            Number(product.quantity) <=
            Number(product.low_stock_threshold)
    ).length;

    const totalUnits = products.reduce(
        (sum, product) => sum + Number(product.quantity || 0),
        0
    );

    const totalValue = products.reduce(
        (sum, product) =>
            sum +
            Number(product.quantity || 0) *
                Number(product.price || 0),
        0
    );

    function openAddForm() {
        setEditingId(null);
        setForm(emptyForm);
        setErrors({});
        setNotice(null);
        setModalOpen(true);
    }

    function openEditForm(product) {
        setEditingId(product.id);
        setForm({
            name: product.name || '',
            sku: product.sku || '',
            category: product.category || 'General',
            quantity: String(product.quantity ?? 0),
            price: String(product.price ?? ''),
            low_stock_threshold: String(
                product.low_stock_threshold ?? 10
            ),
        });
        setErrors({});
        setNotice(null);
        setModalOpen(true);
    }

    function closeForm() {
        if (saving) return;
        setModalOpen(false);
        setEditingId(null);
        setErrors({});
    }

    function updateField(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: undefined }));
    }

    async function saveProduct(event) {
        event.preventDefault();
        setSaving(true);
        setErrors({});
        setNotice(null);

        const isEditing = editingId !== null;
        const url = isEditing
            ? `/products/${editingId}`
            : '/products';

        try {
            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    ...form,
                    quantity: Number(form.quantity),
                    price: Number(form.price),
                    low_stock_threshold: Number(
                        form.low_stock_threshold
                    ),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setErrors(data.errors || {});
                    setNotice({
                        type: 'error',
                        text: data.message || 'Please check the form.',
                    });
                } else {
                    setNotice({
                        type: 'error',
                        text: data.message || 'Unable to save product.',
                    });
                }
                return;
            }

            setModalOpen(false);
            setEditingId(null);
            setForm(emptyForm);
            setNotice({
                type: 'success',
                text: data.message || 'Product saved successfully.',
            });

            await loadProducts();
        } catch {
            setNotice({
                type: 'error',
                text: 'Could not connect to the server. Please try again.',
            });
        } finally {
            setSaving(false);
        }
    }

    async function deleteProduct(product) {
        const confirmed = window.confirm(
            `Delete "${product.name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setDeletingId(product.id);
        setNotice(null);

        try {
            const response = await fetch(`/products/${product.id}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to delete product.'
                );
            }

            setProducts((current) =>
                current.filter((item) => item.id !== product.id)
            );

            setNotice({
                type: 'success',
                text: data.message || 'Product deleted successfully.',
            });
        } catch (error) {
            setNotice({ type: 'error', text: error.message });
        } finally {
            setDeletingId(null);
        }
    }

    function Field({ label, name, type = 'text', min, step, placeholder }) {
        return (
            <div>
                <label
                    htmlFor={name}
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    {label}
                </label>

                <input
                    id={name}
                    name={name}
                    type={type}
                    min={min}
                    step={step}
                    required
                    value={form[name]}
                    onChange={updateField}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                {errors[name]?.[0] && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors[name][0]}
                    </p>
                )}
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Products',
            value: products.length.toLocaleString(),
            icon: Package,
            style: 'bg-blue-50 text-blue-600',
        },
        {
            label: 'Total Units',
            value: totalUnits.toLocaleString(),
            icon: Boxes,
            style: 'bg-violet-50 text-violet-600',
        },
        {
            label: 'Inventory Value',
            value: money(totalValue),
            icon: CircleDollarSign,
            style: 'bg-emerald-50 text-emerald-600',
        },
        {
            label: 'Low Stock',
            value: lowStockCount.toLocaleString(),
            icon: TriangleAlert,
            style: 'bg-amber-50 text-amber-600',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
                <a href="/" className="flex items-center gap-3 px-6 py-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                        S
                    </span>
                    <span className="text-xl font-bold">
                        Stock<span className="text-blue-600">Pilot</span>
                    </span>
                </a>

                <p className="px-6 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Workspace
                </p>

                <nav className="space-y-2 px-3">
                    <a href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
                        <LayoutDashboard size={19} /> Dashboard
                    </a>
                    <a href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50">
                        <Home size={19} /> Home
                    </a>
                    <a href="/products" className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 font-semibold text-blue-700">
                        <Package size={19} /> Products
                    </a>
                </nav>

                <div className="mt-auto border-t border-slate-100 p-5">
                    <form action="/logout" method="POST">
                        <input type="hidden" name="_token" value={csrfToken} />
                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600">
                            <LogOut size={18} /> Log out
                        </button>
                    </form>
                </div>
            </aside>

            <main className="min-w-0 lg:ml-64">
                <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                    <div>
                        <p className="text-sm text-slate-400">
                            Workspace / Products
                        </p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight">
                            Products Management
                        </h1>
                    </div>

                    <button
                        onClick={openAddForm}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                </header>

                <div className="space-y-7 p-5 sm:p-8">
                    {notice && (
                        <div
                            role="status"
                            className={`flex items-center justify-between gap-4 rounded-xl border p-4 text-sm ${
                                notice.type === 'success'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                    : 'border-red-200 bg-red-50 text-red-700'
                            }`}
                        >
                            <span>{notice.text}</span>
                            <button
                                onClick={() => setNotice(null)}
                                aria-label="Dismiss message"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <article
                                    key={stat.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                {stat.label}
                                            </p>
                                            <p className="mt-3 break-words text-2xl font-bold text-slate-900">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`rounded-xl p-3 ${stat.style}`}>
                                            <Icon size={22} />
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Inventory List
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Add, search, update, and manage your products.
                                </p>
                            </div>

                            <button
                                onClick={loadProducts}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                            >
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row">
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search name, SKU, or category..."
                                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <select
                                value={categoryFilter}
                                onChange={(event) => setCategoryFilter(event.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === 'All' ? 'All categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center gap-3 p-12 text-slate-500">
                                <LoaderCircle className="animate-spin" size={22} />
                                Loading products...
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[850px] text-left text-sm">
                                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                            <tr>
                                                <th className="px-5 py-4 font-semibold">Product</th>
                                                <th className="px-5 py-4 font-semibold">SKU</th>
                                                <th className="px-5 py-4 font-semibold">Category</th>
                                                <th className="px-5 py-4 font-semibold">Quantity</th>
                                                <th className="px-5 py-4 font-semibold">Price</th>
                                                <th className="px-5 py-4 font-semibold">Status</th>
                                                <th className="px-5 py-4 text-right font-semibold">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {filteredProducts.map((product) => {
                                                const low =
                                                    Number(product.quantity) <=
                                                    Number(product.low_stock_threshold);

                                                return (
                                                    <tr key={product.id} className="transition hover:bg-slate-50/70">
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                                    <Package size={19} />
                                                                </div>
                                                                <span className="font-semibold text-slate-800">
                                                                    {product.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 text-slate-500">
                                                            {product.sku}
                                                        </td>
                                                        <td className="px-5 py-4 text-slate-600">
                                                            {product.category}
                                                        </td>
                                                        <td className="px-5 py-4 font-semibold">
                                                            {Number(product.quantity).toLocaleString()}
                                                        </td>
                                                        <td className="px-5 py-4 text-slate-600">
                                                            {money(product.price)}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                                low
                                                                    ? 'bg-amber-50 text-amber-700'
                                                                    : 'bg-emerald-50 text-emerald-700'
                                                            }`}>
                                                                {low ? 'Low stock' : 'In stock'}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => openEditForm(product)}
                                                                    title="Edit product"
                                                                    aria-label={`Edit ${product.name}`}
                                                                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                                >
                                                                    <Pencil size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteProduct(product)}
                                                                    disabled={deletingId === product.id}
                                                                    title="Delete product"
                                                                    aria-label={`Delete ${product.name}`}
                                                                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                                >
                                                                    {deletingId === product.id
                                                                        ? <LoaderCircle className="animate-spin" size={16} />
                                                                        : <Trash2 size={16} />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredProducts.length === 0 && (
                                    <div className="p-12 text-center">
                                        <Package className="mx-auto text-slate-300" size={36} />
                                        <h3 className="mt-4 font-semibold text-slate-800">
                                            No products found
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Try another search or add your first product.
                                        </p>
                                        {products.length === 0 && (
                                            <button
                                                onClick={openAddForm}
                                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                                            >
                                                <Plus size={17} /> Add your first product
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
                                    Showing {filteredProducts.length} of {products.length} products
                                </div>
                            </>
                        )}
                    </section>

                    <footer className="pb-4 text-center text-sm text-slate-400">
                        © {new Date().getFullYear()} StockPilot Inventory Management
                    </footer>
                </div>
            </main>

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeForm();
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="product-form-title"
                        className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 id="product-form-title" className="text-xl font-bold">
                                    {editingId ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Enter the product details below.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={saving}
                                aria-label="Close form"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={saveProduct} className="space-y-5 p-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Product Name"
                                        name="name"
                                        placeholder="e.g. Wireless Mouse"
                                    />
                                </div>
                                <Field
                                    label="SKU"
                                    name="sku"
                                    placeholder="e.g. ACC-001"
                                />
                                <Field
                                    label="Category"
                                    name="category"
                                    placeholder="e.g. Accessories"
                                />
                                <Field
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    min="0"
                                    step="1"
                                />
                                <Field
                                    label="Price (PHP)"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Low-Stock Threshold"
                                        name="low_stock_threshold"
                                        type="number"
                                        min="0"
                                        step="1"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        An alert appears when quantity is at or below this number.
                                    </p>
                                </div>
                            </div>

                            {notice?.type === 'error' && (
                                <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                                    {notice.text}
                                </p>
                            )}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                                >
                                    {saving && (
                                        <LoaderCircle className="animate-spin" size={17} />
                                    )}
                                    {saving
                                        ? 'Saving...'
                                        : editingId
                                          ? 'Save Changes'
                                          : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

createRoot(document.getElementById('products-root')).render(<ProductsPage />);
