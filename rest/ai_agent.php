<?php
require 'config/allow_cors.php';
require 'config/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_prompt = $_GET["location"];

    if (!$user_prompt){
        http_response_code(400);
        exit("Provide a location query");
    }
    
    $sys_date = getdate();
    $date = $sys_date["mday"]."/".$sys_date["month"];

    $system_prompt = 'Responde sólamente con una lista de plantas adecuadas para huerto hidropónico que puedan desarrollarse fácilmente en el clima de la ubicación que se te otorgue.
    Considera la siguiente fecha en la que se realizará el cultivo:'.$date.'.
    No incluyas tubérculos en la lista.
    Responde en formato JSON sin usar ```json```.
    EJEMPLO DE PETICIÓN: Culiacán Sinaloa, México
    EJEMPLO DE RESPUESTA:
    {
        "plants": ["Tomate", "Chile", "Lechuga", ...]
    }';

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

    header('Content-Type: application/json');
    exit($message);

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT'){
    $input = json_decode(file_get_contents('php://input'));

    $location = $input->location;
    $plant = $input->plant;
    
    //Input sanitizing
    if (is_string($location) && is_string($plant)){
        $res = array(
            "location" => $location,
            "plant" => $plant
        );

        file_put_contents('/srv/context.json', json_encode($res));

        http_response_code(201);
        exit("Context updated");
    }
    else{
        http_response_code(400);
        exit("missing or invalid parameters");
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $user_prompt = file_get_contents("php://input");

    if (!$user_prompt){
        http_response_code(400);
        $connection->close();
        exit("Prompt required");
    }
    else if (!is_string($user_prompt)){
        http_response_code(400);
        $connection->close();
        exit("Invalid object, please input a string");
    }

    #Acquire monitoring variables to enhance response
    $sql = "SELECT * FROM readings ORDER BY time_stamp DESC LIMIT 24";
    }
    $result = $connection->query($sql);

    $monitoring = "Sin datos";
    if ($result->num_rows > 0) {
        $monitoring = "Fecha y hora | Temperatura | humedad de aire | humedad de sustrato | luminosidad";
        while ($row = $result->fetch_assoc()) {
            $monitoring = $monitoring."\n".$row['time_stamp'].",".$row['temperature'].",".$row['air_hum'].",".$row['soil_hum'].",".$row['light'];
        }

    $context = json_decode(file_get_contents("/srv/context.json"), true);
    $location = $context["location"];
    $plant = $context["plant"];

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
        -Planta sembrada: $plant
    Si lo amerita, puedes comentar acerca de los sistemas autónomos con los que cuenta el huerto:
        -Medición de temperaturas
        -Medición de Humedad de aire
        -Medición de Humedad de sustrato
        -Luminosidad
        -Captura de imagen en tiempo real
        -Calefacción automática
        -Riego automatizado
        -Iluminación artificial automatizada
    Asume que tú tienes el control completo de los sistemas mencionados y los operas según tu criterio, pero si se te solicita activar alguno de ellos indica utilizar la pestaña status en la aplicación movil
    Los últimos registros de las variables de monitoreo son los siguientes:
    $monitoring";

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

    $connection->close();
    exit($message);
} 
else {
    http_response_code(405);
    exit("Unsupported method");
}
?>
