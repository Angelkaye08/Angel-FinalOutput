
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Boxes,
  Menu,
  X,
  Package,
  LayoutDashboard,
  ChartNoAxesCombined,
  ArrowRight,
  ShieldCheck,
  Warehouse,
} from 'lucide-react';

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: Package,
      title: 'Product Management',
      description:
        'Add, view, edit, and delete products from one convenient place.',
      link: '/products',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: LayoutDashboard,
      title: 'Inventory Dashboard',
      description:
        'View inventory summaries and monitor your product records.',
      link: '/dashboard',
      color: 'bg-violet-100 text-violet-700',
    },
    {
      icon: ChartNoAxesCombined,
      title: 'Stock Monitoring',
      description:
        'Keep track of available stock and identify items to restock.',
      link: '/dashboard',
      color: 'bg-emerald-100 text-emerald-700',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <span className="rounded-xl bg-blue-600 p-2.5 text-white">
              <Boxes size={25} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Stock<span className="text-blue-600">Pilot</span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div
            className={`${
              menuOpen ? 'flex' : 'hidden'
            } absolute left-0 top-full w-full flex-col gap-2 border-b border-slate-200 bg-white p-5 shadow-lg md:static md:flex md:w-auto md:flex-row md:items-center md:gap-7 md:border-0 md:p-0 md:shadow-none`}
          >
            <a
              href="/"
              className="rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700 md:bg-transparent"
            >
              Home
            </a>
            <a
              href="/dashboard"
              className="rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            >
              Dashboard
            </a>
            <a
              href="/products"
              className="rounded-lg px-3 py-2 font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            >
              Products
            </a>
            <a
              href="/login"
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700 md:py-2.5"
            >
              Login
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Welcome / Hero Section */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700">
              <Warehouse size={16} />
              Inventory Management System
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Manage your inventory{' '}
              <span className="text-blue-600">with confidence.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Welcome to StockPilot! Organize your products, monitor stock
              levels, and manage your inventory records in one convenient
              workspace.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <Package size={20} />
                Manage Products
                <ArrowRight size={18} />
              </a>

              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <LayoutDashboard size={20} />
                View Dashboard
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={20} className="text-emerald-600" />
              Organized, reliable, and easy to use.
            </div>
          </div>

          {/* Inventory Illustration */}
          <div className="relative rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-50 to-violet-100 p-5 sm:p-10">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-blue-200/60" />
            <div className="absolute -bottom-3 -left-3 h-16 w-16 rounded-full bg-violet-200/60" />

            <div className="relative rounded-2xl border border-white bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8">
              <div className="mb-7 flex items-center gap-4">
                <div className="rounded-xl bg-blue-600 p-3 text-white">
                  <Boxes size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Inventory Workspace
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Everything in one place
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Package,
                    title: 'Product Catalog',
                    subtitle: 'Manage product records',
                    color: 'bg-blue-100 text-blue-700',
                  },
                  {
                    icon: ChartNoAxesCombined,
                    title: 'Stock Monitoring',
                    subtitle: 'Keep track of stock levels',
                    color: 'bg-violet-100 text-violet-700',
                  },
                  {
                    icon: LayoutDashboard,
                    title: 'Dashboard',
                    subtitle: 'Review inventory information',
                    color: 'bg-emerald-100 text-emerald-700',
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
                    >
                      <span className={`rounded-xl p-3 ${item.color}`}>
                        <Icon size={22} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-800">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                          {item.subtitle}
                        </p>
                      </div>
                      <ArrowRight
                        size={18}
                        className="shrink-0 text-slate-400"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Your workspace is ready to use
              </div>
            </div>
          </div>
        </section>

        {/* Main Content / Features */}
        <section className="bg-white px-5 py-16 sm:px-8 md:py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Simple and efficient
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to manage stock
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Use one system to organize products, review inventory, and
                keep track of your stock records.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5"
                  >
                    <div
                      className={`inline-flex rounded-xl p-4 ${feature.color}`}
                    >
                      <Icon size={27} />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-3 min-h-14 leading-7 text-slate-600">
                      {feature.description}
                    </p>
                    <a
                      href={feature.link}
                      className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Learn more
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <a
            href="/"
            className="flex items-center gap-2 font-extrabold text-slate-800"
          >
            <Boxes size={22} className="text-blue-600" />
            StockPilot
          </a>
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} StockaiPilot Inventory Management System
          </p>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<HomePage />);
