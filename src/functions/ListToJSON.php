<?php session_start();

	include 'functions.php';
	$listname = $_POST['listname'];
	$end = $_POST['max'];
	$file = $_POST['file'];

	spit($file);
	clearFile($file);

	$jointarray = array();
	for ($i=0; $i < $end; $i++) {  
		foreach ($_SESSION[$listname][$i] as $key => $value) {
			array_push($jointarray, $value);
		}
	}
	$finalarray = array('data' => $jointarray);

	$str = json_encode($finalarray);
	obj_to_file($file, $str);
?>