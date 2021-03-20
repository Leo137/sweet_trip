<?php
	
	$path = '../levels';
	$results = array_diff(scandir($path), array('..', '.'));
	$levels = array();
	foreach($results as $result){
		$r = $path.'/'.$result;
		if(is_dir($r)){
			$levels[] = $result;
		}
	}

	echo json_encode($levels);

?>