<?php
require_once __DIR__ . '/../conexion/conexion.php';

class UserModel extends conexion {

    public function __construct() {
        parent::__construct();
    }

    public function registrarUsuario($nombre, $correo, $contrasena) {
        $sql = "INSERT INTO usuarios (nombre, correo, contrasena, tipo_usuario) VALUES (?, ?, ?, 'gratis')";
        $comando = $this->conexion->prepare($sql);
        
        if ($comando) {
            $comando->bind_param("sss", $nombre, $correo, $contrasena);
            $resultado = $comando->execute();
            $comando->close();
            return $resultado;
        }
        return false;
    }

    public function verificarCorreo($correo) {
        $sql = "SELECT id FROM usuarios WHERE correo = ?";
        $comando = $this->conexion->prepare($sql);
        
        if ($comando) {
            $comando->bind_param("s", $correo);
            $comando->execute();
            $comando->store_result();
            $existe = $comando->num_rows > 0;
            $comando->close();
            return $existe;
        }
        return false;
    }

    public function obtenerUsuarioPorCorreo($correo) {
        $sql = "SELECT id, nombre, correo, contrasena, tipo_usuario FROM usuarios WHERE correo = ?";
        $comando = $this->conexion->prepare($sql);
        
        if ($comando) {
            $comando->bind_param("s", $correo);
            $comando->execute();
            $usuario = $comando->get_result()->fetch_assoc();
            $comando->close();
            return $usuario;
        }
        return null;
    }

    public function obtenerUsuarioPorId($id) {
        $sql = "SELECT tipo_usuario FROM usuarios WHERE id = ?";
        $comando = $this->conexion->prepare($sql);
        
        if ($comando) {
            $comando->bind_param("i", $id);
            $comando->execute();
            $usuario = $comando->get_result()->fetch_assoc();
            $comando->close();
            return $usuario;
        }
        return null;
    }
}
?>