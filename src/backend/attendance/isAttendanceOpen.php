<?php
include_once "../engine/database.php";
include_once "../engine/header.php";
require("../engine/engineFunctions.php");
require_once("../engine/authenticationClass.php");


$db = new db_engine();
$connection = $db->db_connection();

$data = json_decode(file_get_contents("php://input"));

if($data){
    $token = AuthenticationClass::getBearerToken();
    $checkToken = verifyJWT($token);

    if($checkToken == 1){
        $username = $connection->real_escape_string($data->name);
        // ide majd kell még egy dátum
        $result = $connection->query("SELECT * FROM `attendance` WHERE `areaName`='$username' and isOpen='Y'");
        $rf = $result->fetch_assoc();

        if($result->num_rows == 1){
            echo 'yes';
        }else echo 'no';
    }else{
        echo "tokenError";
    }
}
