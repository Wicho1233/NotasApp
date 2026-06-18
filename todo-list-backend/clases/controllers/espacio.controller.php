<?php
require_once __DIR__ . '/../models/espacio.model.php';
require_once __DIR__ . '/../models/user.model.php';

class EspacioController {

    public function crear() {
        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);

        $accion = $datos['accion'] ?? 'crear';
        $nombre = $datos['nombre'] ?? '';
        $id_usuario = $datos['id_usuario'] ?? '';
        $id_workspace = $datos['id'] ?? '';

        $model = new EspacioModel();

        if ($accion === 'crear') {
            if ($nombre == '' || $id_usuario == '') {
                echo json_encode(["status" => "error", "message" => "falta rellenar campos"]);
                return;
            }

            $userModel = new UserModel();
            $usuario = $userModel->obtenerUsuarioPorId($id_usuario);
            $tipo = $usuario['tipo_usuario'] ?? 'gratis';

            if ($tipo === 'gratis') {
                $totalEspacios = $model->contarEspaciosUsuario($id_usuario);
                if ($totalEspacios >= 3) {
                    echo json_encode(["status" => "limite", "message" => "sube a premium"]);
                    return;
                }
            }

            $exito = $model->crearEspacio($nombre, $id_usuario);

            if ($exito) {
                echo json_encode(["status" => "success", "message" => "espacio creado"]);
            } else {
                echo json_encode(["status" => "error", "message" => "error al guardar"]);
            }
            return;
        }

        if ($accion === 'editar') {
            if ($nombre == '' || $id_workspace == '') {
                echo json_encode(["status" => "error", "message" => "falta rellenar campos"]);
                return;
            }

            $exito = $model->editarWorkspace($id_workspace, $nombre);

            if ($exito) {
                echo json_encode(["status" => "success", "message" => "workspace actualizado"]);
            } else {
                echo json_encode(["status" => "error", "message" => "error al actualizar"]);
            }
            return;
        }

        if ($accion === 'eliminar') {
            if ($id_workspace == '') {
                echo json_encode(["status" => "error", "message" => "falta id de workspace"]);
                return;
            }

            $exito = $model->eliminarWorkspace($id_workspace);

            if ($exito) {
                echo json_encode(["status" => "success", "message" => "workspace eliminado"]);
            } else {
                echo json_encode(["status" => "error", "message" => "error al eliminar"]);
            }
            return;
        }
    }

    public function listar() {
        $id = $_GET['id_usuario'] ?? '';
        
        if ($id == '') {
            echo json_encode(["status" => "error", "message" => "falta id de usuario"]);
            return;
        }
        
        $model = new EspacioModel();
        $lista = $model->traerEspacios($id);
        echo json_encode($lista);
    }
}
?>