
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>StockPilot - Dashboard</title>
    @vite(['resources/css/app.css', 'resources/js/dashboard.jsx'])
</head>
<body>
    <div id="dashboard-root"></div>

    <script>
        window.dashboardData = {{ Illuminate\Support\Js::from($dashboardData) }};
    </script>
</body>
</html>
