<?php session_start();

	include 'functions.php';
	$listname = $_POST['listname'];
	$end = $_POST['max'];
	$file = $_POST['file'];

	spit($file);
	clearFile($file);
	for ($i=0; $i < $end; $i++) {
		arr_to_file($file, $_SESSION[$listname][$i]);
	}
?>