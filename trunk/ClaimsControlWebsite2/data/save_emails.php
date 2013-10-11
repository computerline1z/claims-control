<?php

	if( strlen($_POST["email"]) < 1 ){
		exit();
	}

	date_default_timezone_set('Europe/Vilnius');

	$date_array = getdate();
	$date = $date_array["year"] . "-" . $date_array["mon"] . "-" . $date_array["mday"] . " " . $date_array["hours"] . ":" . $date_array["minutes"] . ":" . $date_array["seconds"];

	$file = 'emails.php';
	$current = file_get_contents($file);
	$current .= '<div class="row"><div class="cell">' . $date . '</div><div class="cell">' . $_POST["email"] .  '</div></div>';
	file_put_contents($file, $current);
	echo "success";
?>