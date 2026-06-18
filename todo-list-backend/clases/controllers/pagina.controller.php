<?php
require_once __DIR__ . '/../models/pagina.model.php';
require_once __DIR__ . '/../models/user.model.php';

class PaginaController {

    public function crear() {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);

        $accion = $datos['accion'] ?? 'crear';
        $titulo = $datos['titulo'] ?? 'Sin titulo';
        $contenido = $datos['contenido'] ?? '';
        $id_espacio = $datos['workspace_id'] ?? $datos['espacio_trab_id'] ?? '';
        $link_archivo = $datos['link_archivo'] ?? null;
        $id_usuario = $datos['id_usuario'] ?? '';
        $id_nota = $datos['id'] ?? '';

        $model = new PaginaModel();

        if ($accion === 'crear') {

            if ($id_espacio == '' || $id_usuario == '') {
                echo json_encode([
                    "status" => "error",
                    "message" => "faltan ids requeridos"
                ]);
                return;
            }

            $userModel = new UserModel();
            $usuario = $userModel->obtenerUsuarioPorId($id_usuario);

            $tipo = $usuario['tipo_usuario'] ?? 'gratis';

            if ($tipo === 'gratis') {

                $totalPaginas = $model->contarPaginasEspacio($id_espacio);

                if ($totalPaginas >= 3) {
                    echo json_encode([
                        "status" => "limite",
                        "message" => "limite de 3 paginas alcanzado para cuenta gratis"
                    ]);
                    return;
                }

                if (!empty($link_archivo)) {
                    echo json_encode([
                        "status" => "premium_required",
                        "message" => "subir imagenes es una funcion Premium"
                    ]);
                    return;
                }
            }

            $exito = $model->crearPagina(
                $titulo,
                $contenido,
                $link_archivo,
                $id_espacio
            );

            if ($exito) {

                echo json_encode([
                    "status" => "success",
                    "message" => "Pagina guardada"
                ]);

            } else {

                $error_mysql = $_SESSION['db_error'] ?? 'Error desconocido';

                echo json_encode([
                    "status" => "error",
                    "message" => "Error al guardar: " . $error_mysql
                ]);
            }

            return;
        }

        if ($accion === 'editar') {

            if ($id_nota == '') {
                echo json_encode([
                    "status" => "error",
                    "message" => "Falta el id de la pagina para editar"
                ]);
                return;
            }

            if ($id_usuario == '') {
                echo json_encode([
                    "status" => "error",
                    "message" => "Falta el id del usuario"
                ]);
                return;
            }

            $userModel = new UserModel();
            $usuario = $userModel->obtenerUsuarioPorId($id_usuario);

            $tipo = $usuario['tipo_usuario'] ?? 'gratis';

            if ($tipo === 'gratis' && !empty($link_archivo)) {

                echo json_encode([
                    "status" => "premium_required",
                    "message" => "Subir imagenes es una funcion Premium"
                ]);

                return;
            }

            $exito = $model->editarPagina(
                $id_nota,
                $titulo,
                $contenido,
                $link_archivo
            );

            if ($exito) {

                echo json_encode([
                    "status" => "success",
                    "message" => "Pagina actualizada correctamente"
                ]);

            } else {

                echo json_encode([
                    "status" => "error",
                    "message" => "Error al actualizar la pagina"
                ]);
            }

            return;
        }

        if ($accion === 'eliminar') {

            if ($id_nota == '') {
                echo json_encode([
                    "status" => "error",
                    "message" => "Falta el id de la pagina para eliminar"
                ]);
                return;
            }

            $exito = $model->eliminarPagina($id_nota);

            if ($exito) {

                echo json_encode([
                    "status" => "success",
                    "message" => "Pagina personalizada eliminada"
                ]);

            } else {

                echo json_encode([
                    "status" => "error",
                    "message" => "Error al eliminar la pagina"
                ]);
            }

            return;
        }
    }

    public function listar() {

        $id_espacio = $_GET['espacio_trab_id'] ?? '';

        if ($id_espacio == '') {

            echo json_encode([
                "status" => "error",
                "message" => "Falta el id del espacio"
            ]);

            return;
        }

        $model = new PaginaModel();
        $paginas = $model->traerPaginasPorEspacio($id_espacio);

        echo json_encode($paginas);
    }
}
?>