<?php
include_once "../engine/database.php";
include_once "../engine/header.php";
require("../engine/engineFunctions.php");


$db = new db_engine();
$connection = $db->db_connection();

$data = json_decode(file_get_contents("php://input"));

if($data){
    $response = array();
    
    $username = $connection->real_escape_string($data->username);
    $password = md5($connection->real_escape_string($data->password));

    $result = $connection->query("SELECT * FROM `accounts` WHERE `username`='$username' AND `password`='$password'");
    $rf = $result->fetch_assoc();

    if($result->num_rows == 1){
        if($rf['status'] == "enabled"){
            $asd = $rf['empID'];
            $result2 = $connection->query("SELECT * FROM `employee` WHERE `id`='$asd'");
            $rf2 = $result2->fetch_assoc();

            $response['token'] = createJWT($rf['id'], $rf['username'], $rf['permission']);
            $response['id'] = $rf['id'];
            $response['username'] = $rf['username'];
            $response['permission'] = $rf['permission'];
            $response['empID'] = $rf['empID'];
            $response['name'] = $rf2["name"];

            echo json_encode($response);
        }else echo 'disabled';
    }else echo 'no';
}