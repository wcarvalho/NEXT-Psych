<?php
//_____________________________________________
// Pushes each line of a test file to the end of the referenced array
//______________________________________________
function PushFileToArray($filename, &$array)
{
	$handle = fopen($filename, "r");
	if ($handle)
	{
    while (($line = fgets($handle)) !== false) {
    	array_push($array, trim($line));
    }
	} 
	else {
		echo("error reading in file" . $filename);
	} 
	foreach ($array as &$value)
    $value = trim($value);
	fclose($handle);	
}

//_____________________________________________
// Load a json object into a PHP Array
//______________________________________________
function jsonToArray($file)
{
	$json_obj = file_get_contents($file,0,null);
	$php_obj = json_decode($json_obj);
	$obj_array = (array)$php_obj;
	return $obj_array;
}


?>