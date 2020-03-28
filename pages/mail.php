<?php
if(!isset($_POST['mailSubmit'])) {
	echo "error; you need to submit the form!";
}
$name = $_POST['mailName'];
$visitor_email = $_POST['mailEmail'];
$message = $_POST['mailMessage'];

if(empty($name) || empty($visitor_email)) {
  echo "Name and email are mandatory!";
  header("location:contact.html?mail=ko");
}
if(IsInjected($visitor_email)) {
  echo "Bad email value!";
  header("location:contact.html?mail=ko");
}

$email_from = 'loizeauanthony@gmail.com';
$email_subject = "Contact Libr@ction";
$email_body = "Vous avez reçu un mail de $name.\n Message :\n $message";

$to = "loizeauanthony@gmail.com";
$headers = "From: $email_from \r\n";
$headers .= "Reply-To: $visitor_email \r\n";

mail($to, $email_subject, $email_body, $headers);
header("location:contact.html?mail=ok");

// Function to validate against any email injection attempts
function IsInjected($str) {
  $injections = array('(\n+)',
              '(\r+)',
              '(\t+)',
              '(%0A+)',
              '(%0D+)',
              '(%08+)',
              '(%09+)'
              );
  $inject = join('|', $injections);
  $inject = "/$inject/i";
  if(preg_match($inject,$str)) {
    return true;
  }
  else {
    return false;
  }
}
?>
