<?php session_start();

	include 'functions.php';

	$name = $_POST['name'];

	$_SESSION[$name] = array();

	if (count($_SESSION[$name]) == 0){
		echo true;
	}
?>