<?php
header("Access-Control-Allow-Origin: *");
$str_json = file_get_contents('php://input');

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

debug_to_console($str_json);

?>