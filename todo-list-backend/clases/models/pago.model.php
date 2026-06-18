<?php
require_once __DIR__ . '/../conexion/conexion.php';

class PagoModel {
    private $db;

    public function __construct() {
        $this->db = new conexion();
    }

    public function simularPagoPremium($id_usuario, $monto) {
        $id_usuario = (int)$id_usuario;
        $monto = (float)$monto;

        try {
            
            $sqlUsuario = "UPDATE usuarios SET tipo_usuario = 'premium' WHERE id = $id_usuario";
            $this->db->nonQuery($sqlUsuario);

            
            $sqlPago = "INSERT INTO pagos_suscripciones (usuario_id, monto, fecha_pago, estado_pago) VALUES ($id_usuario, $monto, NOW(), 'aprobado')";
            $this->db->nonQuery($sqlPago);

            return true;
        } catch (Exception $e) {
            error_log("Error en PagoModel::simularPagoPremium: " . $e->getMessage());
            return false;
        }
    }
}