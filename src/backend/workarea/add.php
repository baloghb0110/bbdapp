<?php
include_once "../engine/database.php";
include_once "../engine/header.php";
require("../engine/engineFunctions.php");
require_once("../engine/authenticationClass.php");


$db = new db_engine();
$connection = $db->db_connection();

$data = json_decode(file_get_contents("php://input"));
$arr = array();

if($data){
    $token = AuthenticationClass::getBearerToken();
    $checkToken = verifyJWT($token);
    
    if($checkToken == 1){
        $insert = $connection->query("INSERT INTO `areas` (name) VALUES ('$data->name')");
        if($insert){

            $arr["lastid"] = $connection->insert_id;
            echo json_encode($arr);
        }
        else echo $insert;
    }else{
        echo "tokenError";
    }

}