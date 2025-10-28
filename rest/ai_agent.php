<?php
require 'config/allow_cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $c = curl_init('https://untwistable-helena-unexpiated.ngrok-free.dev/');
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    $page = curl_exec($c);
    curl_close($c); 

    echo ($pase);

} else {
    http_response_code(405);
    exit("Unsupported method");
}
?>
