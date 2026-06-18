<?php

require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->safeLoad();

class Conexion {
 
    private $server;
    private $user;
    private $password;
    private $database;
    private $port;
    protected $conexion;

    function __construct(){

      
        $this->server   = $_ENV['DB_SERVER']   ?? null;
        $this->user     = $_ENV['DB_USER']     ?? null;
        $this->password = $_ENV['DB_PASSWORD'] ?? null;
        $this->database = $_ENV['DB_DATABASE'] ?? null;
        $this->port     = $_ENV['DB_PORT']     ?? 3306;

        
        if (!$this->server || !$this->user || !$this->password || !$this->database) {
            die("Error: Faltan variables de entorno de la base de datos");
        }

        $this->conexion = new mysqli(
            $this->server,
            $this->user,
            $this->password,
            $this->database,
            $this->port
        );
        
        if ($this->conexion->connect_error) {
            die("Error de conexión a la base de datos");
        }
    }

    private function convertirUTF8($array){
        array_walk_recursive($array, function(&$item){
            if (!mb_detect_encoding($item, 'utf8', true)) {
                $item = utf8_encode($item);
            }
        });
        return $array;
    }

    public function obtenerDatos($sqlstr){
        $results = $this->conexion->query($sqlstr);
        $resultArray = array();
        
        if ($results) {
            foreach ($results as $row) {
                $resultArray[] = $row;
            }
        }
        
        return $this->convertirUTF8($resultArray);
    }

    public function nonQuery($sqlstr){
        $this->conexion->query($sqlstr);
        return $this->conexion->affected_rows;
    }
}
?>