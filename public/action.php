<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *") ;

$str_json = file_get_contents('php://input');

$arr = json_decode($str_json, true);
$arr['some'] = "success";


echo json_encode($arr);

?>