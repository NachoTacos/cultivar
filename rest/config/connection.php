<?php
$host = getenv("DB_HOST");
$user = getenv("DB_USER");
$pass = getenv("DB_PASS");
$database = getenv("DB_NAME");

if (!$host || !$user || !$database){
    die("Undefined database credentials");
}
try {
    $connection = new mysqli($host, $user, $pass, $database);
    mysqli_query($connection, 'SET NAMES "utf8"');
} catch (\Throwable $th) {
    die("Connection failed: " . mysqli_connect_error());
}
?>