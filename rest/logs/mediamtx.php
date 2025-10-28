<?php
require '../config/allow_cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $file = fopen('/srv/mediamtx.log','r');

    if($file){
        while(! feof($file)) {
            $line = fgets($file);
            echo $line. "<br>";
        }
        fclose($file);
        exit();
    }
    else{
        http_response_code(204);
        exit("Unavailable endpoint, please wait");
    }
} else {
    http_response_code(405);
    exit("Unsupported method");
}
?>
