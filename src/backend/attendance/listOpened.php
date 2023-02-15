<?php
include_once "../engine/database.php";
include_once "../engine/header.php";
require("../engine/engineFunctions.php");
require_once("../engine/authenticationClass.php");


$db = new db_engine();
$connection = $db->db_connection();

$token = AuthenticationClass::getBearerToken();
$checkToken = verifyJWT($token);

if($checkToken == 1){
    $query = $connection->query("SELECT * FROM `attendance` WHERE isOpen='Y'");
    $response = array();

    if($query->num_rows >= 1){
        while($rf = $query->fetch_assoc()){
            $t = array(
                "dbid" => $rf["id"],
                "areaName" => $rf["areaName"],
            );
            array_push($response, $t);
        }

        echo json_encode($response);
    }else{
        echo 'nincs';
    }
}else{
    echo "tokenError";
}
