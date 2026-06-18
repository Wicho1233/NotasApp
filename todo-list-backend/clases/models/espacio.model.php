<?php
require_once __DIR__ . '/../conexion/conexion.php';

class EspacioModel extends conexion {
        //contructor
    public function __construct() {
        parent::__construct();
    }

    public function contarEspaciosUsuario($id_usuario) {
        $sql = "SELECT COUNT(*) as total FROM espacios_trabajo WHERE propietario_id = ?";
        $comando = $this->conexion->prepare($sql);
        $total = 0;
        
        if ($comando) {
            $comando->bind_param("i", $id_usuario);
            $comando->execute();
            $resultado = $comando->get_result()->fetch_assoc();
            $total = $resultado['total'];
            $comando->close();
        }
        return $total;
    }

    public function crearEspacio($nombre, $id_usuario) {
        $sql = "INSERT INTO espacios_trabajo (nombre, propietario_id) VALUES (?, ?)";
        $comando = $this->conexion->prepare($sql);
        
        if ($comando) {
            $comando->bind_param("si", $nombre, $id_usuario);
            $resultado = $comando->execute();
            $comando->close();
            return $resultado;
        }
        return false;
    }

    public function editarWorkspace($id_workspace, $nombre) {
        $sql = "UPDATE espacios_trabajo SET nombre = ? WHERE id = ?";
        $comando = $this->conexion->prepare($sql);
        
        if ($comando) {
            $comando->bind_param("si", $nombre, $id_workspace);
            $resultado = $comando->execute();
            $comando->close();
            return $resultado;
        }
        return false;
    }

    public function eliminarWorkspace($id_workspace) {
        $sql = "DELETE FROM espacios_trabajo WHERE id = ?";
        $comando = $this->conexion->prepare($sql);
        
        if ($comando) {
            $comando->bind_param("i", $id_workspace);
            $resultado = $comando->execute();
            $comando->close();
            return $resultado;
        }
        return false;
    }

    public function traerEspacios($id_usuario) {
        $sql = "SELECT * FROM espacios_trabajo WHERE propietario_id = ?";
        $comando = $this->conexion->prepare($sql);
        $arreglo = [];
        
        if ($comando) {
            $comando->bind_param("i", $id_usuario);
            $comando->execute();
            $resultado = $comando->get_result();
            while ($fila = $resultado->fetch_assoc()) {
                $arreglo[] = $fila;
            }
            $comando->close();
        }
        return $arreglo;
    }
}
?>