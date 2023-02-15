<?php
class db_engine {
    private $db_host = "127.0.0.1";
    private $db_name = "comtech";
    private $db_username = "root";
    private $db_password = "";

    private $conn;

    public function db_connection(){
        $this->conn = null;

        $this->conn = new mysqli($this->db_host, $this->db_username, $this->db_password, $this->db_name);

        if(mysqli_connect_errno()){
            echo 'Connection error'.mysqli_connect_error();
        }

        return $this->conn;
    }
}