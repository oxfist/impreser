<?php 
$emailTo = 'andres.caro.q@gmail.com';
$siteTitle = 'Impreser';

error_reporting(E_ALL ^ E_NOTICE); // hide all basic notices from PHP

//If the form is submitted
if (isset($_POST['submitted'])) {
	
	// require a name from user
	if (trim($_POST['contactName']) === '') {
		$nameError = '¡Olvidaste tu nombre!';
		$hasError = true;
	} else {
		$name = strip_tags(trim($_POST['contactName']));
	}
	
	// need valid email
	if (trim($_POST['email']) === '')  {
		$emailError = 'Olvidaste ingresar tu dirección de email.';
		$hasError = true;
	} else if (!preg_match("/^[[:alnum:]][a-z0-9_.-]*@[a-z0-9.-]+\.[a-z]{2,4}$/i", trim($_POST['email']))) {
		$emailError = 'Ingresaste una dirección de email inválida.';
		$hasError = true;
	} else {
		$email = strip_tags(trim($_POST['email']));
	}
		
	// we need at least some content
	if (trim($_POST['comments']) === '') {
		$commentError = '¡Olvidaste ingresar un mensaje!';
		$hasError = true;
	} else {
		if (function_exists('stripslashes')) {
			$comments = stripslashes(trim($_POST['comments']));
		} else {
			$comments = strip_tags(trim($_POST['comments']));
		}
	}
		
	// upon no failure errors let's email now!
	if (!isset($hasError)) {
		
		$subject = 'Nuevo mensaje para '.$siteTitle.' de '.$name;
		$sendCopy = trim($_POST['sendCopy']);
		$body = "Nombre: $name \n\nEmail: $email \n\nMensaje: $comments";
		$headers = 'From: ' .' <'.$email.'>' . "\r\n" . 'Reply-To: ' . $email;

		mail($emailTo, $subject, $body, $headers);
		
        //Autorespond
		$respondSubject = 'Gracias por contactar a '.$siteTitle;
		$respondBody = "¡Tu mensaje a $siteTitle ha sido entregado! \n\nTe responderemos lo antes posible.";
		$respondHeaders = 'From: ' .' <'.$emailTo.'>' . "\r\n" . 'Reply-To: ' . $emailTo;
		
		mail($email, $respondSubject, $respondBody, $respondHeaders);
		
        // set our boolean completion value to TRUE
		$emailSent = true;
	}
}
?>