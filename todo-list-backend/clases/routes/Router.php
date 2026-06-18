<?php
require_once __DIR__ . '/../controllers/registro.controller.php';
require_once __DIR__ . '/../controllers/login.controller.php';
require_once __DIR__ . '/../controllers/espacio.controller.php';
require_once __DIR__ . '/../controllers/pagina.controller.php';
require_once __DIR__ . '/../controllers/pago.controller.php';
require_once __DIR__ . '/../controllers/stripewebhook.controller.php';

class Router {
    public function dispatch($url, $metodo) {
        
        if ($url === '/' && $metodo === 'GET') {
            echo json_encode(["status" => "funcionando"]);
            return;
        }

        if ($url === '/register' && $metodo === 'POST') {
            $controller = new RegistroController();
            $controller->registrar();
            return;
        }

        if ($url === '/login' && $metodo === 'POST') {
            $controller = new LoginController();
            $controller->login();
            return;
        }

        if ($url === '/espacios' && $metodo === 'POST') {
            $controller = new EspacioController();
            $controller->crear();
            return;
        }

        if ($url === '/ver-espacios' && $metodo === 'GET') {
            $controller = new EspacioController();
            $controller->listar();
            return;
        }

        if ($url === '/paginas' && $metodo === 'POST') {
            $controller = new PaginaController();
            $controller->crear();
            return;
        }

        if ($url === '/ver-paginas' && $metodo === 'GET') {
            $controller = new PaginaController();
            $controller->listar();
            return;
        }

        if ($url === '/simular-pago' && $metodo === 'POST') {
            $controller = new PagoController();
            $controller->procesarPagoSimulado();
            return;
        }

        if ($url === '/crear-sesion-pago' && $metodo === 'POST') {
            $controller = new PagoController();
            $controller->crearSesionPago();
            return;
        }
        
        if ($url === '/verificar-pago' && $metodo === 'POST') {
            $controller = new StripeWebhookController();
            $controller->verificarPagoExitoso();
            return;
        }

        echo json_encode(["error" => "no encontrado"]);
    }
}
?>