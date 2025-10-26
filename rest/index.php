<?php
require 'config/connection.php';

if ($connection->connect_error) {
    die("Error connecting to database: " . $connection->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $param = $_GET["param"];

    //To view historic data a param must me specified
    if ($param == "temperature" || $param == "air_hum" || $param == "soil_hum" || $param == "light"){
        $sql = "SELECT time_stamp, $param FROM readings ORDER BY time_stamp DESC LIMIT 30";
    }
    else{
        $sql = "SELECT * FROM readings ORDER BY time_stamp DESC LIMIT 1";
    }
    $result = $connection->query($sql);

    if ($result->num_rows > 0) {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        
        header('Content-Type: application/json');
        if ($param){
            echo json_encode($data);
        } else{
            echo json_encode($data[0]);
        }
    } else {
        http_response_code(204);
        echo "No data";
    }

} else {
    http_response_code(405);
    echo("Unsupported method");
}

$connection->close();
exit();
?>
