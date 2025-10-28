<?php
$sock = socket_create(AF_UNIX, SOCK_STREAM, 0);
socket_connect($sock, "/tmp/api_observer.sock");
?>