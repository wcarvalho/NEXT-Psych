<?php
	
	include 'functions.php';
  $place = $_GET["place"];

	$files = [];
  ListtoArray("../../experiments/first/html/order.txt", $files);

  if ($place != 0)
  {
  	$where = array_search($place, $array);
	  $last = $array[sizeof($array) -1];
  	print($where);
	  if ($where != $last)
	  {
	  	echo $files[$where+1];
	  }
	  else
	  {
	  	echo "done";
	  }
  }
  else
  {
  	echo($files[0]);
  }

?>