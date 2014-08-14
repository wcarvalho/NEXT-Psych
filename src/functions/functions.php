<?php

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
	$json_obj = file_get_contents($file,0,null);
	$php_obj = json_decode($json_obj);
	$obj_array = (array)$php_obj;
	return $obj_array;
}

function spit($var)
{
	echo("\nspit:\n"); var_dump($var); echo("\n");
}

function clearFile($file){
	file_put_contents($file, "");	
}

function obj_to_file($file, $info){

	$handle = fopen($file, 'a');
	fwrite($handle, $info);
	fclose($handle);
}

function arr_to_file($file, $array){

	$handle = fopen($file, 'a');
	// print($handle);

	foreach ($array as $outterkey => $event) {
		$line = "";
		foreach ($event as $innerkey => $member) {
			$addition = $innerkey ." : ";
			if (is_array($member)){
				foreach ($member as $i => $val) {
					$addition .= $val;
					if ($val != $member[count($member)-1])
						$addition .= ", ";
					else
						$addition .= "; ";
				}
				$line .= $addition;
			}
			else{
				$addition .= $member . "; ";
				$line .= $addition;
			}
		}
		$line .= "\n";
		fwrite($handle, $line);
	}
	fclose($handle);
}

?>
