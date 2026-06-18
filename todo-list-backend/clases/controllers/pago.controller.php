<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../models/pago.model.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->safeLoad();

class PagoController {

    public function crearSesionPago() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit;
        }

        $secretKey = $_ENV['STRIPE_SECRET_KEY'] ?? null;

        if (!$secretKey) {
            echo json_encode([
                "status" => "error",
                "message" => "Falta STRIPE_SECRET_KEY en .env"
            ]);
            exit;
        }

        \Stripe\Stripe::setApiKey($secretKey);

        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);
        $id_usuario = $datos['id_usuario'] ?? '';

        if (empty($id_usuario)) {
            echo json_encode([
                "status" => "error",
                "message" => "Falta el id de usuario"
            ]);
            exit;
        }

        try {
            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'mxn',
                        'product_data' => [
                            'name' => 'Suscripción Premium - Todo-List',
                            'description' => 'Desbloquea la creación ilimitada de notas y espacios',
                        ],
                        'unit_amount' => 14900,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',

                // 🔥 TU FRONTEND DE NETLIFY
                'success_url' => 'https://celebrated-fenglisu-f3908d.netlify.app/pago-exitoso?session_id={CHECKOUT_SESSION_ID}&user_id=' . $id_usuario,
                'cancel_url' => 'https://celebrated-fenglisu-f3908d.netlify.app/pago-cancelado',
            ]);

            echo json_encode([
                "status" => "success", 
                "url" => $session->url 
            ]);

        } catch (Exception $e) {
            echo json_encode([
                "status" => "error", 
                "message" => "Error al crear sesión de pago"
            ]);
        }

        exit;
    }
}
?>