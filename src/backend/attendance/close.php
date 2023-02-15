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
        $query = $connection->query("UPDATE `attendance` SET `isOpen` = 'N' WHERE `id`='$data->id'");
        if($query === true){
            echo '1';
        }else{
            echo $query;
        }
    }else{
        echo "tokenError";
    }
}