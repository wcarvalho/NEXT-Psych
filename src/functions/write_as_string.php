<?php

	include 'functions.php';

	
 	$obj = $_POST['set'];
	$filename = $_POST['file'];

	// var_dump($obj);
	print("filename dump ");
	var_dump($filename);
	arr_to_file($filename, $obj);

?>