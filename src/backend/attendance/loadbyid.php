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
        $query = $connection->query("SELECT * FROM `attendance` WHERE id='$data->id'");
        $rf = $query->fetch_assoc();

        if($query->num_rows == 1){
            $t = array(
                "dbid" => $rf["id"],
                "areaName" => $rf["areaName"],
                "data" => $rf["data"],
                "createDate" => $rf["createDate"],
                "closeDate" => $rf["closeDate"],
                "createName" => $rf["createName"],
                "closeName" => $rf["closeName"],
                "comment" => $rf["comment"],
            );

            echo json_encode($t);
        }else{
            echo 'nincs';
        }
    }else{
        echo "tokenError";
    }
}
