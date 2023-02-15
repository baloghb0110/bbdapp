<?php
include_once "../engine/database.php";
include_once "../engine/header.php";
require("../engine/engineFunctions.php");
require_once("../engine/authenticationClass.php");


$db = new db_engine();
$connection = $db->db_connection();

$data = json_decode(file_get_contents("php://input"));

if($data){
    $query = $connection->query("DELETE FROM `employee` WHERE id='$data->id'");

    if($query === true){
        echo "success";
    }else{
        echo "Hiba a törlésben ". $query->error;
    }
}