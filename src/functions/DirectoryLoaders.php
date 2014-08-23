<?php

//_____________________________________________
// Pushes each file in the directory to the end of the referenced 2D array
// Each row has two elements--the first has the filepath, the second has the filename.
//______________________________________________

function PushDirToArray($direc, &$finalarray)
{
	$array = scandir($direc,true);

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

?>