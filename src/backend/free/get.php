<?php
include_once "../engine/database.php";
include_once "../engine/header.php";
require("../engine/engineFunctions.php");
require_once("../engine/authenticationClass.php");


$db = new db_engine();
$connection = $db->db_connection();

$data = json_decode(file_get_contents("php://input"));
$response = array();

if($data){
    $token = AuthenticationClass::getBearerToken();
    $checkToken = verifyJWT($token);
    
    if($checkToken == 1){
        $query = $connection->query("SELECT * FROM `freedoms` WHERE DATE(dateStart) >= DATE('$data->start') AND DATE(dateEnd) <= DATE('$data->end')");
        if($query){
            while($rf = $query->fetch_assoc()){
                $t = array(
                    "id" => $rf["id"],
                    "name" => $rf["name"],
                    "startDate" => $rf["dateStart"],
                    "endDate" => $rf["dateEnd"],
                    "data" => $rf["data"],
                    "empID" => $rf["empID"],
                );
            
                array_push($response, $t);
            }
            echo json_encode($response);
        }
        else echo $query;
    }else{
        echo "tokenError";
    }
}