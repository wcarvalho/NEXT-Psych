<?php

	include 'functions.php';
	// current file being viewed
  $current = $_GET["current"];


  // consult textfile for next
  $array = [];
  ListtoArray("../../experiments/first/html/order.txt", $array);

  $index = array_search($current, $array);
  $last = $array[sizeof($array) -1];
  
  // echo the next file
  if ($current != $last){
  	echo $array[$index+1];
	} else {
		echo "done";
	}
?>