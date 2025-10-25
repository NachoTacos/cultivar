<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $file = fopen('/srv/connection.txt','r');
    if ($file){
        $route = fgets($file);

        header('Content-Type: application/json');

        $res = array(
            "url" => substr($route, 6, 14),
            "port" => substr($route, 21, -1)
        );
        echo(json_encode($res));
    }
    else{
        http_response_code(204);
        echo ("Unavailable endpoint, please wait");
    }
} else {
    http_response_code(405);
    exit("Unsupported method");
}
?>
