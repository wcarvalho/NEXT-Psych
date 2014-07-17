<?php

$HOME = "../../";

function ListtoArray($filename, &$array)
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

function load_direc($direc, &$finalarray)
{

	$array =scandir($direc,true);

	$pusharray = array();
	foreach($array as $val)
	{
		if (($val != ".")&&($val != "..")&&($val != ".DS_Store"))
		{
		array_push($pusharray, trim($direc));
		array_push($pusharray, trim($val));
		array_push($finalarray, $pusharray);
		unset($pusharray);
		$pusharray = array();
		}
	}

}

function jsonfile_array($file)
{
	$json_obj = file_get_contents($HOME.$file,0,null);
	$php_obj = json_decode($json_obj);
	$obj_array = (array)$php_obj;
	return $obj_array;
}

function spit($var)
{
	var_dump($var); echo("<br>");
}
?>
