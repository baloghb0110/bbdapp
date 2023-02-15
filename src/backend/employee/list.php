<?php
include_once "../engine/database.php";
include_once "../engine/header.php";
require("../engine/engineFunctions.php");
require_once("../engine/authenticationClass.php");


$db = new db_engine();
$connection = $db->db_connection();

$query = $connection->query("SELECT * FROM `employee`");

$response = array();

while($rf = $query->fetch_assoc()){
    $t = array(
        "id" => $rf["id"],
        "name" => $rf["name"],
        "data" => $rf["pData"],
        "status" => $rf["status"],
    );

    array_push($response, $t);
}

echo json_encode($response);