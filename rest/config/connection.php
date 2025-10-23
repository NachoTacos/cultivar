<?php
try {
    $connection = new mysqli(getenv("DB_HOST"), getenv("DB_USER"), getenv("DB_PASS"), getenv("DB_NAME"));
    mysqli_query($connection, 'SET NAMES"'."utf8".'"');

} catch (\Throwable $th) {
    die("Connection failed: " . mysqli_connect_error());
}
?>