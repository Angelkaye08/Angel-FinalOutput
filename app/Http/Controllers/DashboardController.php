<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $totalProducts = Product::count();

        $stockQuantity = Product::sum('quantity');

        $inventoryValue = Product::selectRaw(
            'COALESCE(SUM(quantity * price), 0) as total'
        )->value('total');

        $lowStockProducts = Product::whereColumn(
            'quantity',
            '<=',
            'low_stock_threshold'
        )
            ->orderBy('quantity')
            ->take(5)
            ->get();

        $recentProducts = Product::latest()
            ->take(5)
            ->get();

        return view('dashboard', [
            'dashboardData' => [
                'totalProducts' => $totalProducts,
                'stockQuantity' => $stockQuantity,
                'inventoryValue' => (float) $inventoryValue,
                'lowStockProducts' => $lowStockProducts,
                'recentProducts' => $recentProducts,
            ],
        ]);
    }
}
