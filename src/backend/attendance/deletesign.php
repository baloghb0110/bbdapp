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
        $status = unlink("../../signatures/".$data->id."/".$data->imgname.".png");
        if($status)
            echo "success";
        else
            echo "error";
    }else{
        echo "tokenError";
    }
}
