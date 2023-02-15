<?php
    header("Access-Control-Allow-Origin: ". $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true' );
    header('Access-Control-Request-Method: *');
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
/*
header('Access-Control-Allow-Origin: '. $_SERVER['HTTP_ORIGIN'] );
header('Access-Control-Allow-Credentials: true' );
header('Access-Control-Request-Method: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: *,x-requested-with,Content-Type');
header('X-Frame-Options: DENY');*/