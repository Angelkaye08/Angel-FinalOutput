
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>StockPilot - Account</title>
    @vite(['resources/css/app.css', 'resources/js/auth.jsx'])
</head>
<body>
    <div id="auth-root"></div>
</body>
</html>
