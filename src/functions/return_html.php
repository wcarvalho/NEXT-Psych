<?php
	//load contents of file into string
	$html = $_GET["html_file"];

	//echo string
	echo file_get_contents("../../".trim($html));

?>