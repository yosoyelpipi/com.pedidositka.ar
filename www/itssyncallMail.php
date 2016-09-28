<?php
header("Access-Control-Allow-Origin: *");
date_default_timezone_set("America/Argentina/Buenos_Aires");
$ItsGetDate = date("Y/m/d H:i:s");
require_once('lib/nusoap.php');


//Función para ser usada para grabar los archivos que vayan entregando los m�todos de Itris.
function GrabarXML($XMLData,$nombre){
    $now = date('Ymd-H-i-s');
    $fp = fopen($nombre.$now.".xml", "a");
    fwrite($fp, $XMLData. PHP_EOL);
    fclose($fp);
}

//Función para ser usada para grabar los archivos que vayan entregando los m�todos de Itris.
function GrabarTXT($String,$name){
    $now = date('Ymd-H-i-s');
    $fpt = fopen($name.".log", "a");
    fwrite($fpt, $String. PHP_EOL);
    fclose($fpt);
}

//Función para ser usada para grabar los archivos que vayan entregando los m�todos de Itris.
function GrabarJson($String,$name){
    $now = date('Ymd-H-i-s');
    $fpt = fopen($name.".json", "a");
    fwrite($fpt, $String. PHP_EOL);
    fclose($fpt);
}

$ws = $_GET["ws"];
$bd = $_GET["base"];
$user = $_GET["usuario"];
$pass = $_GET["pass"];
$datos = $_GET["datos"];
$id = '';
$todo='';
$iderr='';
$todOK='';

/*
$ws = "http://iserver,itris.com.ar:3000/ITSWS/ItsCliSvrWS.asmx?WSDL";
$bd = "LM_10_09_14";
$user = "administrador";
$pass = "12348";
*/
//http://leocondori.com.ar/app/local/itssync.php?id=777&empresa=000001178&articulo=AC-02-090&precio=4702.88

    GrabarJson($datos,$ItsGetDate);
    //Lo decodifico y obtengo un array.
    $String = json_decode($datos);
    
    //Cuento los resultados, pero por ahora no hago nada. solo guardo en la variable $resultados para pasarlo por el JSON al cliente, pero nada m·s.
    $resultados = count($String);





$destinatario = "lcondori@gmail.com"; 
$asunto = "Este mensaje es de prueba"; 
$cuerpo = ''; 
//Adjunto el fichero
$cuerpo .= "\n\n"."--Message-Boundary"."\n";
$cuerpo .= "Content-type: Binary; name=".$ItsGetDate."\n";
$cuerpo .= "Content-Transfer-Encoding: BASE64"."\n";
$cuerpo .= "Content-disposition: attachment; filename=".$ItsGetDate."\n";
$cuerpo .= $datos."\n";
$cuerpo .= "--Message-Boundary--";

//para el envío en formato HTML 
$headers = "MIME-Version: 1.0\r\n"; 
$headers .= "Content-type: text/html; charset=iso-8859-1\r\n"; 

//dirección del remitente 
$headers .= "From: Leo Condori <lcondori@itris.com.ar>\r\n"; 

//dirección de respuesta, si queremos que sea distinta que la del remitente 
//$headers .= "Reply-To: mariano@desarrolloweb.com\r\n"; 

//ruta del mensaje desde origen a destino 
//$headers .= "Return-path: holahola@desarrolloweb.com\r\n"; 

//direcciones que recibián copia 
//$headers .= "Cc: maria@desarrolloweb.com\r\n"; 

//direcciones que recibirán copia oculta 
//$headers .= "Bcc: pepe@pepe.com,juan@juan.com\r\n"; 

mail($destinatario,$asunto,$cuerpo,$headers) 


?>