<?php
require_once __DIR__ . '/../models/user.model.php';

class LoginController {

    public function login() {
        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);

        $correo = $datos['correo'] ?? '';
        $password = $datos['contrasena'] ?? '';

        if (empty($correo) || empty($password)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "todos los campos son obligatorios."]);
            return;
        }

        $userModel = new UserModel();
        $usuario = $userModel->obtenerUsuarioPorCorreo($correo);

        if (!$usuario || $password !== $usuario['contrasena']) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "correo o contraseña incorrectos."]);
            return;
        }

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Inicio de sesion exitoso",
            "usuario" => [
                "id" => $usuario['id'],
                "nombre" => $usuario['nombre'],
                "correo" => $usuario['correo'],
                "tipo_usuario" => $usuario['tipo_usuario']
            ]
        ]);
    }
}
?>