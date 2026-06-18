<?php
require_once __DIR__ . '/../models/user.model.php';
// Permitir peticiones desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Si es una petición OPTIONS (preflight), terminar aquí
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}
class RegistroController {

    public function registrar() {
        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);

        $nombre = $datos['nombre'] ?? '';
        $correo = $datos['correo'] ?? '';
        $password = $datos['contrasena'] ?? '';

        if (empty($nombre) || empty($correo) || empty($password)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios."]);
            return;
        }

        $userModel = new UserModel();

        if ($userModel->verificarCorreo($correo)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "El correo electrónico ya está registrado."]);
            return;
        }

        //$passwordEncriptado = password_hash($password, PASSWORD_BCRYPT);
        $exito = $userModel->registrarUsuario($nombre, $correo, $password);

        if ($exito) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "¡Usuario registrado correctamente!"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error interno del servidor al registrar usuario."]);
        }
    }
}
?>