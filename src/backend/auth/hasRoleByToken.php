<?php
include_once "../engine/header.php";
require("../engine/engineFunctions.php");

$data = json_decode(file_get_contents("php://input"));

$errorArray = array(
    "keyError",
    "payloadError",
    "error",
);


function checkError($value, $array){
    return (array_search($value, $array)) ? 'true' : 'false';
}

if($data){
    $tokenRole = getRoleByToken($data->token);
    $response = array();

    if(checkError($tokenRole, $errorArray) === "false"){
        $response['permission'] = $tokenRole;
        $response['status'] = true;
        echo json_encode($response);
    }else{
        $response['status'] = $tokenRole;
        echo json_encode($response);
    }
}
