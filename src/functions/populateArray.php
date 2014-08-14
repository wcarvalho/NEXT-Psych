<?php session_start();

	include 'functions.php';

	$listname = $_POST['listname'];
	$which = $_POST['which'];
	$array = $_POST['set'];
	$max = $_POST['max'];
	$max = $max -1;

	$_SESSION[$listname][$which] = $array;
	if ($which == $max){
		print(true);
	}

?>