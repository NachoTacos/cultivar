<?php
require 'config/allow_cors.php';

$state_file = '/srv/activation.json';

require 'config/socket.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $activation = file_get_contents($state_file);

    if ($activation){
        header('Content-Type: application/json');
        http_response_code(200);
        exit($activation);
    }
    else{
        http_response_code(204);
        exit("No data");
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'));

    $illum = $input->illumination;
    $heating = $input->heat;
    
    //Input sanitizing
    if (is_bool($illum) && is_bool($heating)){
        $res = array(
            "illumination" => $illum,
            "heat" => $heating
        );
        file_put_contents($state_file, json_encode($res));
        socket_write($sock, "caca");

        http_response_code(201);
        exit("Activation successful");
    }
    else{
        http_response_code(400);
        exit("missing or invalid parameters");
    }

} else {
    http_response_code(405);
    exit("Unsupported method");
}
?>
