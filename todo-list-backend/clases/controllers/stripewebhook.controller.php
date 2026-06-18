<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../models/pago.model.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->safeLoad(); 
class StripeWebhookController {

    public function verificarPagoExitoso() {
        
        if (ob_get_length()) ob_clean();
        
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
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

        $session_id = $datos['session_id'] ?? '';
        $id_usuario = $datos['id_usuario'] ?? '';

        if (empty($session_id) || empty($id_usuario)) {
            echo json_encode([
                "status" => "error",
                "message" => "Datos incompletos"
            ]);
            exit;
        }

        try {
            $session = \Stripe\Checkout\Session::retrieve($session_id);

            if ($session->payment_status === 'paid') {
                $model = new PagoModel();
                $monto = $session->amount_total / 100;
                
                $exito = $model->simularPagoPremium($id_usuario, $monto); 

                echo json_encode([
                    "status" => $exito ? "success" : "error",
                    "message" => $exito ? "Pago verificado" : "Error al actualizar BD"
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Pago no completado"
                ]);
            }

        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Error al verificar pago"
            ]);
        }

        exit;
    }
}
?>