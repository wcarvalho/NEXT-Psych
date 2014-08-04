<?php

	include 'functions.php';

 	$obj = $_POST['set'];
	$filename = $_POST['file'];

	arr_to_file($filename, $obj);

?>