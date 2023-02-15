<?php
include("engine/engineFunctions.php");



/*use Firebase\JWT\JWT;
use Firebase\JWT\Key;
echo '<br>';



$key = "nOHAJutckQjn3KhuGwc9BCvud18s0rgmLz6oPGXD8VPfYeO1C79mqRjqEEMOju4kfamMLRKIbwzlYJBfHeSqVtU4mtnQ0kBv7vUPfe9jLdPq2rwf1UKDalDPkrFsg1Yjc27lLUL0VpfYAtmK7IDORnveDYAbDsKu7AeXOR7yXSkpoHn3BJMtceEcnA6QgrjEU6znJpx4ISXbzXhlE3UXIqcZxm01sg25CuKGysr1mRFf7meOFtkthXR7XcoXKje4";

$issuedAt = time();
// jwt valid for 60 days (60 seconds * 60 minutes * 24 hours * 60 days)
$expirationTime = $issuedAt + 60 * 60 * 24 * 60;  
$id = "1";
$username   = "username";   
$payload = [
	'iat' => $issuedAt,
	'nbf'  => $issuedAt,
	'exp' => $expirationTime,
	'username' => $username,
	'id' => $id,
	
];

$asd = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjkxMTkzMzQsIm5iZiI6MTY2OTExOTMzNCwiZXhwIjoxNjc0MzAzMzM0LCJ1c2VybmFtZSI6ImJhcm5pIiwiaWQiOiIxIn0.rAuu5Sj9eEvK8X-SuYhzgIPf05h5P-Sp7-x7gZh8RWc';

$decode = JWT::decode($asd, new Key($key, 'HS256'));
print_r($decode);

// erre kell irni egy ellenorzest hogy lejart mar az ido vagy nem*/
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;

$a = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjkxMTkzMzQsIm5iZiI6MTY2OTExOTMzNCwiZXhwIjoxNjc0MzAzMzM0LCJ1c2VybmFtZSI6ImJhcm5pIiwiaWQiOiIxIn0.rAuu5Sj9eEvK8X-SuYhzgIPf05h5P-Sp7-x7gZh8RWc";
$asd = verifyJWT("");
echo $asd;