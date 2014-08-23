<?php

//_____________________________________________
// Clears the contents of a file
//______________________________________________
function clearFile($file){
	file_put_contents($file, "");	
}

//_____________________________________________
// Clears the contents of a file
//______________________________________________
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
