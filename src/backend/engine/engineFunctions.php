<?php
require_once __DIR__.'/../Firebase/JWT.php';
require_once __DIR__.'/../Firebase/Key.php';
require_once __DIR__.'/../Firebase/SignatureInvalidException.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
error_reporting(E_ALL);

function generateRandomString($length = 16){
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;  
}

function verifyJWT($string){
    try {
        $key = "nOHAJutckQjn3KhuGwc9BCvud18s0rgmLz6oPGXD8VPfYeO1C79mqRjqEEMOju4kfamMLRKIbwzlYJBfHeSqVtU4mtnQ0kBv7vUPfe9jLdPq2rwf1UKDalDPkrFsg1Yjc27lLUL0VpfYAtmK7IDORnveDYAbDsKu7AeXOR7yXSkpoHn3BJMtceEcnA6QgrjEU6znJpx4ISXbzXhlE3UXIqcZxm01sg25CuKGysr1mRFf7meOFtkthXR7XcoXKje4";

        $decode = JWT::decode($string, new Key($key, 'HS256'));
        $now = new DateTimeImmutable();
    
        if(!isset($decode->id) || !isset($decode->username))
            return 'invalid';
    
        if($decode->exp < $now->getTimeStamp())
            return 'expired';
    
        if($decode->nbf > $now->getTimeStamp())
            return 'expired';
    
        return true;
    } catch (UnexpectedValueException $throwable) {
        return 'keyError';
    } catch (DomainException $throwable) {
        return 'payloadError';
    } catch(InvalidArgumentException $throwable){
        return 'error';
    }
    return false;
}

function createJWT($id, $username, $permission){
    $key = "nOHAJutckQjn3KhuGwc9BCvud18s0rgmLz6oPGXD8VPfYeO1C79mqRjqEEMOju4kfamMLRKIbwzlYJBfHeSqVtU4mtnQ0kBv7vUPfe9jLdPq2rwf1UKDalDPkrFsg1Yjc27lLUL0VpfYAtmK7IDORnveDYAbDsKu7AeXOR7yXSkpoHn3BJMtceEcnA6QgrjEU6znJpx4ISXbzXhlE3UXIqcZxm01sg25CuKGysr1mRFf7meOFtkthXR7XcoXKje4";
    $issuedAt = time();
    // jwt valid for 60 days (60 seconds * 60 minutes * 24 hours * 60 days)
    $expirationTime = $issuedAt + 60 * 60 * 24 * 60;    
    $payload = [
        'iat' => $issuedAt,
        'nbf'  => $issuedAt,
        'exp' => $expirationTime,
        'username' => $username,
        'id' => $id,
        'permission' => $permission,
        
    ];

    $jwt = JWT::encode($payload, $key, 'HS256');
    return $jwt;
}


function getRoleByToken($string){
    try {
        $key = "nOHAJutckQjn3KhuGwc9BCvud18s0rgmLz6oPGXD8VPfYeO1C79mqRjqEEMOju4kfamMLRKIbwzlYJBfHeSqVtU4mtnQ0kBv7vUPfe9jLdPq2rwf1UKDalDPkrFsg1Yjc27lLUL0VpfYAtmK7IDORnveDYAbDsKu7AeXOR7yXSkpoHn3BJMtceEcnA6QgrjEU6znJpx4ISXbzXhlE3UXIqcZxm01sg25CuKGysr1mRFf7meOFtkthXR7XcoXKje4";

        $decode = JWT::decode($string, new Key($key, 'HS256'));
    
        return $decode->permission;
    } catch (UnexpectedValueException $throwable) {
        return 'keyError';
    } catch (DomainException $throwable) {
        return 'payloadError';
    } catch(InvalidArgumentException $throwable){
        return 'error';
    }
    return false;    
}