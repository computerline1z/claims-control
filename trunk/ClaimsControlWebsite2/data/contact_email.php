<?php

if( strlen($_POST['senderName']) < 1 ){
	exit();
}

$sendTo      = 't.kikutis@gmail.com';
$mailFrom = 'ClaimsControl';
$subject = 'Žinutė iš susisiekimo formos';


$senderName = $_POST['senderName'];
$senderEmail = $_POST['senderContacts'];
$senderMessage = $_POST['senderMessage'];


$message = 'Vartotojo įvesti duomenys:'. "\n" .'Vardas: ' . $senderName . "\n" . 'El.paštas/telefonas: ' . $senderEmail . "\n" . 'Žinutė: ' . $senderMessage;

$headers = 'From: ' . $mailFrom . "\r\n" .
    'Reply-To: ' . $mailFrom . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($sendTo, $subject, $message, $headers);

?>