<?php

	include 'functions.php';

 	$obj = $_POST['set'];
	$filename = $_POST['file'];

	$str = json_encode($obj);

	obj_to_file($filename, $str);

?>