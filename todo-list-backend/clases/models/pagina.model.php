<?php
require_once __DIR__ . '/../conexion/conexion.php';

class PaginaModel extends conexion {

    public function __construct() {
        parent::__construct();
    }

    public function contarPaginasEspacio($id_espacio) {
        $sql = "SELECT COUNT(*) as total FROM paginas WHERE espacio_trab_id = ?";
        $query = $this->conexion->prepare($sql);
        $total = 0;
        
        if ($query) {
            $query->bind_param("i", $id_espacio);
            $query->execute();
            $resultado = $query->get_result()->fetch_assoc();
            $total = $resultado['total'];
            $query->close();
        }
        return $total;
    }

    public function crearPagina($titulo, $contenido, $link_archivo, $id_espacio) {
        $sql = "INSERT INTO paginas (titulo, contenido, link_archivo, espacio_trab_id) VALUES (?, ?, ?, ?)";
        $query = $this->conexion->prepare($sql);
        
        if ($query) {
            $query->bind_param("sssi", $titulo, $contenido, $link_archivo, $id_espacio);
            $resultado = $query->execute();
            $query->close();
            return $resultado;
        } else {
            $_SESSION['db_error'] = $this->conexion->error;
            return false;
        }
    }

    public function editarPagina($id_nota, $titulo, $contenido, $link_archivo) {
       
        $sql = "UPDATE paginas SET titulo = ?, contenido = ?, link_archivo = ? WHERE id = ?";
        $query = $this->conexion->prepare($sql);
        
        if ($query) {
            
            $query->bind_param("sssi", $titulo, $contenido, $link_archivo, $id_nota);
            $resultado = $query->execute();
            $query->close();
            return $resultado;
        }
        return false;
    }

    public function eliminarPagina($id_nota) {
        $sql = "DELETE FROM paginas WHERE id = ?";
        $query = $this->conexion->prepare($sql);
        
        if ($query) {
            $query->bind_param("i", $id_nota);
            $resultado = $query->execute();
            $query->close();
            return $resultado;
        }
        return false;
    }

    public function traerPaginasPorEspacio($id_espacio) {
        $sql = "SELECT * FROM paginas WHERE espacio_trab_id = ?";
        $query = $this->conexion->prepare($sql);
        $arreglo = [];
        
        if ($query) {
            $query->bind_param("i", $id_espacio);
            $query->execute();
            $resultado = $query->get_result();
            while ($fila = $resultado->fetch_assoc()) {
                $arreglo[] = $fila;
            }
            $query->close();
        }
        return $arreglo;
    }
}
?>