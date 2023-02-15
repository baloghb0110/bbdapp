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
        $path_name = "../../signatures/".$data->id;
        if(!file_exists($path_name)){ mkdir($path_name); }
        $pattern = "/^data:image\/(png|jpg);base64,/";

        $sign = $data->sign;
        $sign = preg_replace($pattern, "", $sign);

        $imagedata = base64_decode($sign);
        $filename = md5(date("dmYhisA"));
        
        $file_name = $path_name."/".$filename.".png";
        if(file_put_contents($file_name, $imagedata)){
            echo $filename;
        }else echo "error";
    }else{
        echo "tokenError";
    }
}
