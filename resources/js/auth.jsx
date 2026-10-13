
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function AuthPage() {
    const isRegister = window.location.pathname === '/register';

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function updateField(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrors({});
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(
                isRegister ? '/register' : '/login',
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setErrors(data.errors || {});
                    setMessage(
                        data.message || 'Please check your information.'
                    );
                } else {
                    setMessage(
                        data.message || 'Something went wrong. Please try again.'
                    );
                }
                return;
            }

            window.location.assign(data.redirect || '/dashboard');
        } catch (error) {
            setMessage('Unable to connect. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function fieldError(name) {
        return errors[name]?.[0];
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
                <a href="/" className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
                        S
                    </span>
                    <span className="text-xl font-bold tracking-tight">
                        Stock<span className="text-blue-400">Pilot</span>
                    </span>
                </a>

                <a
                    href="/"
                    className="text-sm text-slate-300 transition hover:text-white"
                >
                    ← Back to Home
                </a>
            </nav>

            <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-12">
                <div className="hidden lg:block">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
                        <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                        Your inventory, organized
                    </div>

                    <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
                        Manage your stock.
                        <span className="mt-2 block text-blue-400">
                            Grow with confidence.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                        Keep products organized, monitor stock levels, and
                        manage your inventory in one simple workspace.
                    </p>

                    <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <div className="text-2xl">📦</div>
                            <h3 className="mt-3 font-semibold">Product tracking</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Keep your inventory details together.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <div className="text-2xl">📊</div>
                            <h3 className="mt-3 font-semibold">Stock overview</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Prepare for your inventory dashboard.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-md">
                    <div className="rounded-3xl border border-white/10 bg-slate-900 p-7 shadow-2xl shadow-black/20 sm:p-9">
                        <div className="mb-8">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                                StockPilot Account
                            </p>

                            <h2 className="mt-3 text-3xl font-bold">
                                {isRegister
                                    ? 'Create your account'
                                    : 'Welcome back'}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                {isRegister
                                    ? 'Sign up to start managing your inventory.'
                                    : 'Sign in to continue to your workspace.'}
                            </p>
                        </div>

                        {message && (
                            <div
                                role="alert"
                                className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
                            >
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isRegister && (
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-slate-200"
                                    >
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        value={form.name}
                                        onChange={updateField}
                                        required
                                        maxLength={255}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Enter your full name"
                                    />
                                    {fieldError('name') && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {fieldError('name')}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-200"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={updateField}
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="you@example.com"
                                />
                                {fieldError('email') && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {fieldError('email')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-200"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete={
                                            isRegister
                                                ? 'new-password'
                                                : 'current-password'
                                        }
                                        value={form.password}
                                        onChange={updateField}
                                        required
                                        minLength={8}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Enter your password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-3 text-sm text-blue-400 hover:text-blue-300"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>

                                {fieldError('password') && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {fieldError('password')}
                                    </p>
                                )}
                            </div>

                            {isRegister && (
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="mb-2 block text-sm font-medium text-slate-200"
                                    >
                                        Confirm password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={form.password_confirmation}
                                        onChange={updateField}
                                        required
                                        minLength={8}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Re-enter your password"
                                    />
                                    {fieldError('password_confirmation') && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {fieldError('password_confirmation')}
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? 'Please wait...'
                                    : isRegister
                                      ? 'Create Account →'
                                      : 'Sign In →'}
                            </button>
                        </form>

                        <div className="mt-7 text-center text-sm text-slate-400">
                            {isRegister
                                ? 'Already have an account? '
                                : "Don't have an account? "}

                            <a
                                href={isRegister ? '/login' : '/register'}
                                className="font-semibold text-blue-400 hover:text-blue-300"
                            >
                                {isRegister ? 'Sign in' : 'Create one'}
                            </a>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                        StockPilot Inventory Management
                    </p>
                </div>
            </section>
        </main>
    );
}

createRoot(document.getElementById('auth-root')).render(<AuthPage />);
