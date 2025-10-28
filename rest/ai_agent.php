<?php
require 'config/allow_cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_prompt = file_get_contents("php://input");

    if (!$user_prompt){
        http_response_code(400);
        exit("Prompt required");
    }
    else if (!is_string($user_prompt)){
        http_response_code(400);
        exit("Invalid object, please input a string");
    }

    $location = "Durango, Dgo. México";
    $sys_date = getdate();
    $date = $sys_date["mday"]."/".$sys_date["month"];

    $system_prompt = "Eres un agente de apoyo en un sistema de monitoreo de un huerto hidropónico.
    Estás hablando por medio de una aplicación móvil conectada al huerto,
    responde brindando apoyo con respecto a dudas unicamente sobre cultivo.
    Características del huerto (No las menciones a menos que se te pregunte):
        -Ubicacion: $location
        -Tipo de sustrato: fibra de coco
        -Fecha: $date
        -Tipo de huerto: vertical, con riego por goteo.
    Si lo amerita, puedes comentar acerca de los sistemas autónomos con los que cuenta el huerto:
        -Medición de temperaturas
        -Medición de Humedad de aire
        -Medición de Humedad de sustrato
        -Luminosidad
        -Captura de imagen en tiempo real
        -Calefacción automática
        -Riego automatizado
        -Iluminación artificial automatizada
    Asume que tú tienes el control completo de los sistemas mencionados y los operas según tu criterio, pero si se te solicita activar alguno de ellos indica utilizar la pestaña status en la aplicación movil";

    $body = array(
        "model" => "deepseek-chat",
        "messages" => array(
            array("role" => "system", "content" => $system_prompt),
            array("role" => "user", "content" => $user_prompt)
        ),
        "stream" => false
    );

    $c = curl_init('https://api.deepseek.com/chat/completions');
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($c, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Accept: application/json",
        "Authorization: Bearer ".getenv("API_KEY")
    ]);
    curl_setopt($c, CURLOPT_POSTFIELDS, json_encode($body));
    $response = curl_exec($c);
    curl_close($c); 

    $message = json_decode($response, true)["choices"][0]["message"]["content"];

    exit($message);

} else {
    http_response_code(405);
    exit("Unsupported method");
}
?>
