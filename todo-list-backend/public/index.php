<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../clases/routes/Router.php';

if (isset($_GET['url'])) {
    $rutaLimpia = '/' . $_GET['url'];
} else {
    $rutaLimpia = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
}

$rutaLimpia = rtrim($rutaLimpia, '/');
if (empty($rutaLimpia)) {
    $rutaLimpia = '/';
}

$metodo = $_SERVER['REQUEST_METHOD'];

$router = new Router();
$router->dispatch($rutaLimpia, $metodo);