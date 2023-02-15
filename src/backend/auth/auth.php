<?php
include_once "../engine/header.php";
require("../engine/engineFunctions.php");

$data = json_decode(file_get_contents("php://input"));

if($data){
    $validate = verifyJWT($data->token);

    echo $validate;
}